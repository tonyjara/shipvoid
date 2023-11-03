// /components/NoSsr.js

import dynamic from "next/dynamic";

const NoSsr = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSsr), { ssr: false });
