import React from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/css/cashier-styles/cashier.order.module.css'
import ReactPaginate from 'react-paginate';

export default function CashierOrder() {
  const router = useRouter();


  return (
    <div className={styles.container} >
      <div className={styles.order__box} >
      
      </div>
    </div>
  )
}
