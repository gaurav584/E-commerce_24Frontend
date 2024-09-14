import { RootState } from "@reduxjs/toolkit/query";
import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Skeleton } from "../components/loader";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];
 
const Orders = () => {
  // get user from store
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);

  // state to maintain the table data
  const [rows, setRows] = useState<DataType[]>([]);

  // check for error before setting the data
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "processing"
                  ? "red"
                  : i.status === "shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          // in this we are using order id to not user id 
          action: (
            <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length>6
  )();
  return (
    <div className="container">
      <h1>My Orders</h1>
      {/* Render your table here using the `rows` state */}
      {isLoading ? <Skeleton length={20} /> : Table}
    </div>
  );
};

export default Orders;
