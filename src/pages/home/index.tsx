import HomePage from "@/pageContainers/Home/Home.page";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
