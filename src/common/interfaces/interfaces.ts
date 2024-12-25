import { Payment } from "src/modules/payment/entities/payment.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Customer } from "src/modules/customer/entities/customer.entity";
import { UpdateOrderDto } from "src/modules/order/schema/order.schema";
import { PaymentItem } from "src/modules/payment/entities/paymentItem.entity";
import { Order } from "src/modules/order/entities/order.entity";


export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  createPayment(payment: Payment): Promise<Payment>;
  createPaymentItems(items: PaymentItem[]): Promise<PaymentItem[]>;
  getProductById(productId: number): Promise<Product | null>;
  updateProductStock(productId: number, quantity: number): Promise<void>;
  getUser(email: string): Promise<Customer | null>;
  updatePaymentStatus(referenceSale: string, updateOrder: UpdateOrderDto): Promise<string>;
}