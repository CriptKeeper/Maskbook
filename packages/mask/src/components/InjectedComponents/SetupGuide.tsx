import { useMemo, useState, useEffect, useRef } from 'react'
import { makeStyles } from '@masknet/theme'
import { useValueRef } from '@masknet/shared'
import { useI18N, MaskMessages } from '../../utils'
import { activatedSocialNetworkUI, SocialNetworkUI } from '../../social-network'
import { currentSetupGuideStatus, dismissPinExtensionTip, userGuideStatus } from '../../settings/settings'
import type { SetupGuideCrossContextStatus } from '../../settings/types'
import {
    PersonaIdentifier,
    ProfileIdentifier,
    Identifier,
    ECKeyIdentifier,
    makeTypedMessageText,
    NextIDPlatform,
    PostIdentifier,
    toBase64,
    fromHex,
} from '@masknet/shared-base'
import Services from '../../extension/service'
import { useLastRecognizedIdentity } from '../DataSource/useActivatedUI'
import { useAsync, useCopyToClipboard } from 'react-use'
import stringify from 'json-stable-stringify'
import type { NextIDPayload } from '@masknet/shared-base'
import { SetupGuideStep } from './SetupGuide/types'
import { FindUsername } from './SetupGuide/FindUsername'
import { VerifyNextID } from './SetupGuide/VerifyNextID'
import { PinExtension } from './SetupGuide/PinExtension'

// #region setup guide ui
interface SetupGuideUIProps {
    persona: PersonaIdentifier
    onClose?: () => void
}

interface SignInfo {
    payload: NextIDPayload
    personaSign: string
    twitterPost: string
}

function SetupGuideUI(props: SetupGuideUIProps) {
    const { t } = useI18N()
    const { persona } = props
    const ui = activatedSocialNetworkUI
    const [, copyToClipboard] = useCopyToClipboard()
    const [step, setStep] = useState(SetupGuideStep.FindUsername)
    // @ts-ignore
    const [signInfo, setSignInfo] = useState<SignInfo>({})
    const [verifiedPost, setVerifiedPost] = useState<null | PostIdentifier>(null)
    const [enableNextID] = useState(ui.configuration.nextIDConfig?.enable)
    const verifyPostCollectTimer = useRef<any>()
    const platform = ui.configuration.nextIDConfig?.platform as NextIDPlatform

    // #region parse setup status
    const lastStateRef = currentSetupGuideStatus[ui.networkIdentifier]
    const lastState_ = useValueRef(lastStateRef)
    const lastState = useMemo<SetupGuideCrossContextStatus>(() => {
        try {
            return JSON.parse(lastState_)
        } catch {
            return {}
        }
    }, [lastState_])
    useEffect(() => {
        setStep(lastState.status ?? SetupGuideStep.Close)
    }, [lastState])
    // #endregion

    // #region setup username
    const lastRecognized = useLastRecognizedIdentity()
    const getUsername = () =>
        lastState.username || (lastRecognized.identifier.isUnknown ? '' : lastRecognized.identifier.userId)
    const [username, setUsername] = useState(getUsername)

    useEffect(() => {
        const handler = (val: SocialNetworkUI.CollectingCapabilities.IdentityResolved) => {
            if (username === '' && !val.identifier.isUnknown) setUsername(val.identifier.userId)
        }
        ui.collecting.identityProvider?.recognized.addListener(handler)

        return () => {
            ui.collecting.identityProvider?.recognized.removeListener(handler)
        }
    }, [username])

    useEffect(() => {
        if (username || ui.networkIdentifier !== 'twitter.com') return
        // In order to collect user info after login, need to reload twitter once
        let reloaded = false
        const handler = () => {
            // twitter will redirect to home page after login
            if (!(!reloaded && location.pathname === '/home')) return
            reloaded = true
            location.reload()
        }
        window.addEventListener('locationchange', handler)
        return () => {
            window.removeEventListener('locationchange', handler)
        }
    }, [username])
    // #endregion

    const { value: persona_ } = useAsync(async () => {
        return Services.Identity.queryPersona(Identifier.fromString(persona.toText(), ECKeyIdentifier).unwrap())
    }, [persona])

    const onConnect = async () => {
        // attach persona with SNS profile
        await Services.Identity.attachProfile(new ProfileIdentifier(ui.networkIdentifier, username), persona, {
            connectionConfirmState: 'confirmed',
        })

        // auto-finish the setup process
        if (!persona_?.hasPrivateKey) throw new Error('invalid persona')
        await Services.Identity.setupPersona(persona_?.identifier)
        MaskMessages.events.ownPersonaChanged.sendToAll(undefined)
    }

    const onVerify = async () => {
        if (!persona_) return
        const collect = ui.configuration.nextIDConfig?.collectVerifyPost
        const platform = ui.configuration.nextIDConfig?.platform as NextIDPlatform
        const isBound = await Services.NextID.queryIsBound(persona_.identifier, platform, username)

        if (!isBound) {
            const payload = await Services.NextID.createPersonaPayload(
                persona_.identifier,
                'create',
                username,
                platform,
            )
            if (!payload) throw new Error('Get Payload Wrong')
            const signResult = await Services.Identity.signWithPersona({
                method: 'eth',
                message: payload.signPayload,
                identifier: persona.toText(),
            })
            if (!signResult) throw new Error('Get Persona Sign Wrong')
            const signature = signResult.signature.signature
            const postContent = payload.postContent.replace('%SIG_BASE64%', toBase64(fromHex(signature)))
            ui.automation?.nativeCompositionDialog?.appendText?.(postContent, { recover: false })

            const waitingPost = new Promise<void>((resolve, reject) => {
                verifyPostCollectTimer.current = setInterval(async () => {
                    // TODO: rename this method
                    const post = collect?.(postContent)
                    if (post) {
                        // setSignInfo({ ...signInfo, personaSign: signature, payload })
                        clearInterval(verifyPostCollectTimer.current)
                        await Services.NextID.bindProof(
                            persona_.identifier,
                            'create',
                            platform,
                            username,
                            undefined,
                            signInfo.personaSign,
                            post.postId,
                        )
                        resolve()
                    }
                }, 1000)

                setTimeout(() => {
                    clearInterval(verifyPostCollectTimer.current)
                    reject({ message: 'Unfind Verify Post' })
                }, 1000 * 20)
            })

            await waitingPost
        }
        onDone()
    }

    const onClose = () => {
        currentSetupGuideStatus[ui.networkIdentifier].value = ''
        setStep(SetupGuideStep.Close)
    }

    const onDone = async () => {
        // check verify nextID id state
        if (step === SetupGuideStep.FindUsername && enableNextID && persona_) {
            const isBound = await Services.NextID.queryIsBound(persona_.identifier, platform, username)
            if (!isBound) {
                currentSetupGuideStatus[ui.networkIdentifier].value = stringify({
                    status: SetupGuideStep.VerifyOnNextID,
                })
                return setStep(SetupGuideStep.VerifyOnNextID)
            }
        }

        // check pin tip status
        if (step === SetupGuideStep.FindUsername && !dismissPinExtensionTip.value) {
            currentSetupGuideStatus[ui.networkIdentifier].value = stringify({ status: SetupGuideStep.PinExtension })
            return setStep(SetupGuideStep.PinExtension)
        }

        // check pin tip status
        if (step === SetupGuideStep.VerifyOnNextID && enableNextID && persona_) {
            const isBound = await Services.NextID.queryIsBound(persona_.identifier, platform, username)
            if (!isBound) return
        }

        // check user guide status
        const network = ui.networkIdentifier
        if (network === 'twitter.com' && userGuideStatus[network].value !== 'completed') {
            userGuideStatus[network].value = '1'
        } else {
            onCreate()
        }

        onClose()
    }

    const onCreate = async () => {
        let content = t('setup_guide_say_hello_content')
        if (ui.networkIdentifier === 'twitter.com') {
            content += t('setup_guide_say_hello_follow', { account: '@realMaskNetwork' })
        }

        ui.automation.maskCompositionDialog?.open?.(makeTypedMessageText(content), {
            target: 'Everyone',
        })
    }

    switch (step) {
        case SetupGuideStep.FindUsername:
            return (
                <FindUsername
                    personaName={persona_?.nickname}
                    username={username}
                    avatar={lastRecognized.avatar}
                    onUsernameChange={setUsername}
                    onConnect={onConnect}
                    onDone={onDone}
                    onClose={onClose}
                />
            )
        case SetupGuideStep.VerifyOnNextID:
            return (
                <VerifyNextID
                    personaName={persona_?.nickname}
                    username={username}
                    avatar={lastRecognized.avatar}
                    onUsernameChange={setUsername}
                    onVerify={onVerify}
                    onDone={() => {}}
                    onClose={onClose}
                />
            )
        case SetupGuideStep.PinExtension:
            return <PinExtension onDone={onDone} />
        default:
            return null
    }
}
// #endregion

// #region setup guide
const useSetupGuideStyles = makeStyles()({
    root: {
        position: 'fixed',
        zIndex: 9999,
        maxWidth: 550,
        top: '2em',
        right: '2em',
    },
})
export interface SetupGuideProps extends SetupGuideUIProps {}

export function SetupGuide(props: SetupGuideProps) {
    const { classes } = useSetupGuideStyles()
    return (
        <div className={classes.root}>
            <SetupGuideUI {...props} />
        </div>
    )
}
// #endregion
