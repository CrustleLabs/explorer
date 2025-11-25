import {useEffect} from "react";

interface PageMetadataArgs {
  title?: string;
}

export function usePageMetadata(args: PageMetadataArgs = {}): void {
  useEffect(() => {
    document.title = args.title
      ? `${args.title} | Crustle Explorer`
      : "Crustle Explorer";
  }, [args]);
}
