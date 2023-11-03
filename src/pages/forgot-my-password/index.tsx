import ForgotMyPasswordPage from "@/pageContainers/forgot-my-password/ForgotMyPasswordPage";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSideProps } from "next";

export default ForgotMyPasswordPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { p = "/" } = ctx.query;

  const session = await getServerAuthSession(ctx);

  const destination = () => {
    if (p.toString().length === 1) return "/home";
    return p.toString();
  };

  if (session) {
    return {
      redirect: {
        destination: destination(),
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
