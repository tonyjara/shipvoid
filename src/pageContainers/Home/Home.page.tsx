import PageContainer from "@/components/Containers/PageContainer";
import { trpcClient } from "@/utils/api";

export default function HomePage() {
  const { data } = trpcClient.admin.countSuccesfulPurchases.useQuery();
  return (
    <PageContainer>
      <div>Dashboard</div>
      <div>{data?.toString()} Succesful purchases</div>
    </PageContainer>
  );
}
