import { use } from './composer'
import { Logger } from './middlewares/Logger'
import { Squash } from './middlewares/Squash'
import { Nonce } from './middlewares/Nonce'
import { Translator } from './middlewares/Translator'
import { Interceptor } from './middlewares/Interceptor'
import { Popup } from './middlewares/Popup'
import { RecentTransaction } from './middlewares/Transaction'
import { TransactionNotifier } from './middlewares/TransactionNotifier'
import { TransactionWatcher } from './middlewares/TransactionWatcher'

use(new Logger())
use(new Squash())
use(new Nonce())
use(new Translator())
use(new Interceptor())
use(new Popup())
use(new RecentTransaction())
use(new TransactionNotifier())
use(new TransactionWatcher())
