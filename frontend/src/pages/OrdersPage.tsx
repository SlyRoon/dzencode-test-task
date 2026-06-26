import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { fetchOrders, fetchDeleteOrder } from "../features/orders/ordersSlice";
import { fetchProducts } from "../features/products/productsSlice";

import OrdersList from "../features/orders/OrdersList";
import OrderDetails from "../features/orders/OrderDetails";
import DeleteOrderModal from "../features/orders/DeleteOrderModal";
import "./OrdersPage.css";

function OrderPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  const { orders, status: oStatus } = useSelector((state: RootState) => state.orders);
  const { products, status: pStatus } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (oStatus === "idle") dispatch(fetchOrders());
    if (pStatus === "idle") dispatch(fetchProducts());
  }, [oStatus, pStatus, dispatch]);

  const ordersWithStats = orders.map((order) => {
    const orderProducts = products.filter((p) => p.order === order.id);

    const totalUSD = orderProducts.reduce((sum, p) => {
      const priceUSD = p.price.find((price) => price.symbol === "USD");
      return sum + (priceUSD ? priceUSD.value : 0);
    }, 0);

    const totalUAH = orderProducts.reduce((sum, p) => {
      const priceUAH = p.price.find((price) => price.symbol === "UAH");
      return sum + (priceUAH ? priceUAH.value : 0);
    }, 0);

    return { ...order, productCount: orderProducts.length, totalUSD, totalUAH };
  });

  const selectedOrder = selectedOrderId
    ? ordersWithStats.find((o) => o.id === selectedOrderId) ?? null
    : null;

  return (
    <div className="orders-page container-fluid px-4 py-4">
      <div className="orders-page-header d-flex align-items-center gap-4 mb-4">
        <button className="orders-add-btn" aria-label={t("orders.addProduct")}>
          <FiPlus size={22} color="#fff" />
        </button>
        <h2 className="orders-page-title m-0">
          {t("orders.title")} / {orders.length}
        </h2>
      </div>

      <div className="orders-page-body d-flex gap-4">
        <OrdersList
          orders={ordersWithStats}
          selectedOrderId={selectedOrderId}
          onSelectOrder={(id) => setSelectedOrderId(id)}
          onDeleteClick={(id) => setOrderToDelete(id)}
        />

        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            products={products.filter((p) => p.order === selectedOrder.id)}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </div>

      {orderToDelete !== null && ordersWithStats.find((o) => o.id === orderToDelete) && (
        <DeleteOrderModal
          products={products.filter((p) => p.order === orderToDelete)}
          onClose={() => setOrderToDelete(null)}
          onConfirm={() => {
            dispatch(fetchDeleteOrder(orderToDelete));
            setOrderToDelete(null);
            if (selectedOrderId === orderToDelete) {
              setSelectedOrderId(null);
            }
          }}
        />
      )}
    </div>
  );
}

export default OrderPage;
