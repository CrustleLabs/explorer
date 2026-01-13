import Box from "@mui/material/Box";
import {keyframes} from "@mui/material";

const scrollAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const CODE_SNIPPET = `/**
 *  An **AbstractPlugin** is used to provide additional internal services
 *  to an [[AbstractProvider]] without adding backwards-incompatible changes
 *  to method signatures or other internal and complex logic.
 */
export interface AbstractProviderPlugin {
    /**
     *  The reverse domain notation of the plugin.
     */
    readonly name: string;

    /**
     *  Creates a new instance of the plugin, connected to %%provider%%.
     */
    connect(provider: AbstractProvider): AbstractProviderPlugin;
}

/**
 *  A normalized filter used for [[PerformActionRequest]] objects.
 */
export type PerformActionFilter = {
    address?: string | Array<string>;
    topics?: Array<null | string | Array<string>>;
    fromBlock?: BlockTag;
    toBlock?: BlockTag;
} | {
    address?: string | Array<string>;
    topics?: Array<null | string | Array<string>>;
    blockHash?: string;
};

/**
 *  A normalized transactions used for [[PerformActionRequest]] objects.
 */
export interface PerformActionTransaction extends PreparedTransactionRequest {
    /**
     *  The \`to\` address of the transaction.
     */
    to?: string;

    /**
     *  The sender of the transaction.
     */
    from?: string;
}

/**
 *  The [[AbstractProvider]] methods will normalize all values and pass this
 *  type to [[AbstractProvider-_perform]].
 */
export type PerformActionRequest = {
    method: "broadcastTransaction",
    signedTransaction: string
} | {
    method: "call",
    transaction: PerformActionTransaction, blockTag: BlockTag
} | {
    method: "chainId"
} | {
    method: "estimateGas",
    transaction: PerformActionTransaction
} | {
    method: "getBalance",
    address: string, blockTag: BlockTag
} | {
    method: "getBlock",
    blockTag: BlockTag, includeTransactions: boolean
} | {
    method: "getBlock",
    blockHash: string, includeTransactions: boolean
} | {
    method: "getBlockNumber"
} | {
    method: "getCode",
    address: string, blockTag: BlockTag
} | {
    method: "getGasPrice"
} | {
    method: "getLogs",
    filter: PerformActionFilter
};

/**
 *  Options for configuring some internal aspects of an [[AbstractProvider]].
 *
 *  **\`cacheTimeout\`** - how long to cache a low-level \`_perform\`
 *  for, based on input parameters. This reduces the number of calls
 *  to getChainId and getBlockNumber, but may break test chains which
 *  can perform operations (internally) synchronously. Use \`-1\` to
 *  disable, \`0\` will only buffer within the same event loop and
 *  any other value is in ms. (default: \`250\`)
 */
export type AbstractProviderOptions = {
    cacheTimeout?: number;
    pollingInterval?: number;
};

const defaultOptions = {
    cacheTimeout: 250,
    pollingInterval: 4000
};

/**
 *  An **AbstractProvider** provides a base class for other sub-classes to
 *  implement the [[Provider]] API by normalizing input arguments and
 *  formatting output results as well as tracking events for consistent
 *  behaviour on an eventually-consistent network.
 */
export class AbstractProvider implements Provider {

    #subs: Map<string, Sub>;
    #plugins: Map<string, AbstractProviderPlugin>;

    // null=unpaused, true=paused+dropWhilePaused, false=paused
    #pausedState: null | boolean;

    #destroyed: boolean;

    #networkPromise: null | Promise<Network>;
    readonly #anyNetwork: boolean;

    #performCache: Map<string, Promise<any>>;\

    // The most recent block number if running an event or -1 if no "block" event
    #lastBlockNumber: number;

    constructor(_network?: Networkish | Promise<Networkish>, options?: AbstractProviderOptions) {
        this.#subs = new Map();
        this.#plugins = new Map();
        
        this.#pausedState = null;
        this.#destroyed = false;
        this.#lastBlockNumber = -1;

        this.#performCache = new Map();
    }
}`;

const highlightCode = (code: string) => {
  let html = code
    // HTML Escape
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Syntax Highlighting (Order Matters!)

  // 1. Strings (green) - Handle both single and double quotes
  html = html.replace(
    /("|')((?:\\\1|(?:(?!\1).))*)\1/g,
    '<span style="color: #6a8759;">$1$2$1</span>',
  );

  // 2. Keywords (orange)
  html = html.replace(
    /\b(export|interface|type|const|let|var|function|return|class|implements|extends|readonly|private|public|protected|static|async|await|new|this|super|if|else|switch|case|default|try|catch|finally|throw|for|while|do|void|null|true|false|undefined)\b/g,
    '<span style="color: #cc7832;">$1</span>',
  );

  // 3. Types / Classes (purple-ish - Heuristic: Capitalized words)
  // We exclude words in strings or already tagged (though we processed strings, regex below might match inside if not careful)
  // Since strings are already spans, `\b[A-Z]\w*\b` will NOT match `<span...` keys usually unless inside style tag?
  // Actually, `<span style="...">` contains capitalized words? No, `style` is lowercase.
  // But content inside spans? `color`...
  // To avoid re-coloring inside HTML tags, we ideally need a parser or careful lookbehind, which JS doesn't support fully everywhere.
  // Simple hack: We already wrapped things.
  // Let's rely on the fact that existing tags are lower case `span`.
  // Hex codes `#6a8759` have no caps? `A-F`...
  // Let's limit Heuristic to Capitalized Words that are NOT inside a tag? Hard with regex.
  // Alternative: Do Types BEFORE strings/keywords?
  // If we do Types first: `\b[A-Z]\w*\b`.
  // Then Keywords.
  // Then Strings.
  // Then Comments.
  // Let's try reordering.

  // Actually, safest is to tokenize or just use a specific list for types if possible.
  // Or just accept that `AbstractProvider` gets colored.
  html = html.replace(
    /\b(String|Number|Boolean|Array|Promise|Map|Set|Object|Function|AbstractProvider|Provider|AbstractProviderPlugin|PerformActionFilter|PerformActionTransaction|PerformActionRequest|BlockTag|AbstractProviderOptions|Network|Networkish)\b/g,
    '<span style="color: #9876aa;">$1</span>',
  );

  // 4. Numbers (blue)
  html = html.replace(/\b(\d+)\b/g, '<span style="color: #6897bb;">$1</span>');

  // 5. Comments (grey) - Multi-line `/* ... */` and Single-line `// ...`
  // We need to match `/* ... */` across newlines.
  // JS regex dot includes newline? No. `[\s\S]*?`

  // Block comments
  html = html.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span style="color: #808080;">$1</span>',
  );

  // Single line comments
  html = html.replace(
    /(\/\/[^\n]*)/g,
    '<span style="color: #808080;">$1</span>',
  );

  return html;
};

export default function ScrollingCodeBackground() {
  const highlightedCode = highlightCode(CODE_SNIPPET);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
        opacity: 0.1, // Reduced visibility to prevent distraction
      }}
    >
      <Box
        sx={{
          animation: `${scrollAnimation} 60s linear infinite`,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: "10px", // Small code
          lineHeight: "1.2",
          color: "#aaa", // Default color
          whiteSpace: "pre",
          textAlign: "left",
        }}
      >
        <div dangerouslySetInnerHTML={{__html: highlightedCode}} />
        {"\n\n"}
        <div dangerouslySetInnerHTML={{__html: highlightedCode}} />
      </Box>
    </Box>
  );
}
