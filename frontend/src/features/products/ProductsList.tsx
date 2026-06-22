import './ProductList.css'

function ProductsList() {
  return (
    <div className="product d-flex align-items-center gap-5">

      <span className="product__status product__status--free">●</span>

      <img className="product__icon" src="monitor-icon.png" alt="monitor" />

      <div className="product__info">
        <p className="product__name">Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3</p>
        <span className="product__serial">SN-12.3456789</span>
      </div>

      <span className="product__condition product__condition--free">свободен</span>

      <div className="product__warranty">
        <span className="product__warranty-from">с 06 / 04 / 2017</span>
        <span className="product__warranty-to">по 06 / 08 / 2025</span>
      </div>

      <span className="product__state">новый</span>

      <div className="product__price">
        <span className="product__price-usd">2 500 $</span>
        <span className="product__price-uah">250 000. 50 уан</span>
      </div>


      <p className="product__group">Длинное предлинное длиннючее название группы</p>

      <span className="product__divider">—</span>

      <p className="product__user">Христорождественский Александр</p>

      <p className="product__order">Длинное предлинное длиннючее название прихода</p>

      <div className="product__date">
        <span className="product__date-short">06 / 12</span>
        <span className="product__date-full">06 / Сен / 2017</span>
      </div>

      <button className="product__delete">🗑</button>

    </div>
  );
}

export default ProductsList;