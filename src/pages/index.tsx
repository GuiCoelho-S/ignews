/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from '../styles/home.module.scss';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId:  string;
    amount:   number;
  }
}
export default function Home({product}: HomeProps) {
  console.log(product)
  return (
    <>
      <Head>
        <title>Home | ig news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get acess to all publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <div className={styles.ImageStyle}>
        <img src="/images/avatar.svg" alt="Girl coding" />
        </div>
        
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async() => {
  
  const price = await stripe.prices.retrieve('price_1K7W8cCChOCHSoT71872wcsW'         //expand -> terá acesso a todas info do produto
  )

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),  // o valor vem em centavos
  }
  return {
    props: {
      product,
    },
    revalidate:60*60*24 //24 hours
  }
}