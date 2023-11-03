import { couponsColumns } from "@/pageContainers/Admin/Coupons/Coupons.columns";
import { CouponsRowOptions } from "@/pageContainers/Admin/Coupons/Coupons.rowOptions";
import DynamicTable, {
  RowOptionsType,
} from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import CreateCouponForm from "@/components/Forms/CreateCoupon.Form";
import { trpcClient } from "@/utils/api";
import { Prisma } from "@prisma/client";
import React, { useState } from "react";
import PageContainer from "@/components/Containers/PageContainer";

const CouponsPage = () => {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.CouponsScalarWhereInput[]
  >([]);

  const { data: coupons, isLoading } = trpcClient.admin.getCoupons.useQuery({
    pageSize,
    pageIndex,
    sorting,
    whereFilterList,
  });

  const { data: count } = trpcClient.admin.countCoupons.useQuery({
    whereFilterList,
  });
  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <CouponsRowOptions
        x={x}
        /* onExpReturnOpen={onExpenseReturnOpen} */
        setMenuData={setMenuData}
      />
    );
  };

  return (
    <PageContainer>
      <DynamicTable
        title="Coupons"
        loading={isLoading}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        headerComp={<CreateCouponForm />}
        columns={couponsColumns({ pageIndex, pageSize })}
        rowOptions={rowOptionsFunction}
        data={coupons ?? []}
        count={count}
        {...dynamicTableProps}
      />
    </PageContainer>
  );
};

export default CouponsPage;
