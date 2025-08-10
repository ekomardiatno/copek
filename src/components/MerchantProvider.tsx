import { createContext, JSX, useState } from 'react';
import { MerchantDetailsType } from '../types/merchant-types';

export const MerchantContext = createContext<{
  merchantIsBeingViewed: MerchantDetailsType | null;
  setMerchantIsBeingViewed: React.Dispatch<
    React.SetStateAction<MerchantDetailsType | null>
  >;
}>({
  merchantIsBeingViewed: null,
  setMerchantIsBeingViewed: () => {},
});

export default function MerchantProvider({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}): JSX.Element {
  const [merchantIsBeingViewed, setMerchantIsBeingViewed] =
    useState<MerchantDetailsType | null>(null);
  return (
    <MerchantContext.Provider
      value={{ merchantIsBeingViewed, setMerchantIsBeingViewed }}
    >
      {children}
    </MerchantContext.Provider>
  );
}
