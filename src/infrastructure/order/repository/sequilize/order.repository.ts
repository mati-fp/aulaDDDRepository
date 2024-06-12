import Order from "../../../../domain/checkout/entity/order";
import OrderFactory from "../../../../domain/checkout/factory/order.factory";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );

    for (const item of entity.items) {
        await OrderItemModel.upsert({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          order_id: entity.id,
          product_id: item.productId,
        });
    }
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: {id}
    });
    return OrderFactory.create({
      id: orderModel.id,
      customerId: orderModel.customer_id,
      items: orderModel.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.product_id,
        quantity: item.quantity,
      })),
    });
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll();
    return orderModels.map((orderModel) => OrderFactory.create({
      id: orderModel.id,
      customerId: orderModel.customer_id,
      items: orderModel.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.product_id,
        quantity: item.quantity,
      })),
    }))
  }
}
