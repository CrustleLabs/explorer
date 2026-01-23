import React from "react";
import UnifiedPageHeader from "../../components/UnifiedPageHeader";

export default function BlockTitle({height}: {height: number}) {
  return (
    <UnifiedPageHeader title="Block Details" metaTitle={`Block ${height}`} />
  );
}
