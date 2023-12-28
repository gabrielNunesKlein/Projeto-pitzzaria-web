import Head from "next/head"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { Header } from "../../components/Header"
import styles from './styles.module.scss';
import { FiRefreshCcw } from 'react-icons/fi';
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import Modal from 'react-modal';
import { ModalOrder } from "../../components/ModalOrder";

type OrderProps = {
    id: string;
    table: string | number;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[]
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}

export default function Dashboard({ orders }: HomeProps){

    const [orderList, setOrderList] = useState(orders || []);
    const [modalItem, setModalItem] = useState<OrderItemProps[]>();
    const [modalVisible, setModalVisible] = useState(false);

    function handleModalClose(){
        setModalVisible(false);
    }

    async function handleOpenModalView(id: string){
       const apiCliente = setupAPIClient();
       const response = await apiCliente.get('/oder/detail', 
       { params: { order_id: id }});

       setModalItem(response.data);
       setModalVisible(true);
    }

    async function handleFinishModal(id: string){
        const apiClient = setupAPIClient();
        await apiClient.put('/order/finish', {
            order_id: id
        })

        const response = await apiClient.get('/orders');
        setOrderList(response.data);

        setModalVisible(false);
    }

    async function handleRefreshOrders(){
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/orders');
        setOrderList(response.data);
    }

    Modal.setAppElement('#__next');

    return (
        <>
            <Head>
                <title>Painel - Sujeito Pitzzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>
                        <button>
                            <FiRefreshCcw
                             size={25}
                             color="#3fffa3"
                             onClick={handleRefreshOrders}
                            />
                        </button>
                    </div>
                    <article className={styles.listOrders}>

                        { orderList.length === 0 && (
                            <span className={styles.emptyList}>
                                Nuhum pedido aberto foi encontrado...
                            </span>
                        )}

                        {orderList.map( item => (
                        <section key={item.id} className={styles.orderItem}>
                            <button onClick={() => handleOpenModalView(item.id)}>
                                <div className={styles.tag}></div>
                                <span>Mesa {item.table} </span>
                            </button>
                        </section>
                        ))}

                    </article>
                </main>
                
                { modalVisible && (
                    <ModalOrder 
                        isOpen={modalVisible}
                        onRequestClose={handleModalClose}
                        order={modalItem}
                        handleFinishOrder={handleFinishModal}
                    />
                )}

            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiCliete = setupAPIClient(ctx);
    const response = await apiCliete.get('/orders');
    console.log(response.data);
    
    return {
        props: {
            orders: response.data
        }
    }

})