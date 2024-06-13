import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendNotificationWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const id = event.eventData.id;
    const nome = event.eventData.name;
    const endereco = event.eventData._address;
    console.log(`Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`); 
  }
}