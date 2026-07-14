import { getCategoryLabel, FALLBACK_IMAGE } from '../services/inventory.js';

function Badge({ product }) {
  if (product.featured) return <span className="pcard__badge">Featured</span>;
  if (product.newArrival)
    return <span className="pcard__badge pcard__badge--new">New</span>;
  if (product.staffPick)
    return <span className="pcard__badge pcard__badge--staff">Staff Pick</span>;
  return null;
}

export function formatPrice(p) {
  return typeof p === 'number' ? `$${p.toFixed(2)}` : null;
}

export default function ProductCard({ product, onSelect }) {
  if (product.placeholder) {
    return (
      <div className="pcard pcard--placeholder" aria-hidden="true">
        <div className="pcard__imgwrap">
          <span className="ph-box">PRODUCT IMAGE</span>
        </div>
        <div className="pcard__body">
          <p className="pcard__brand">CATEGORY</p>
          <p className="pcard__name">Product Name</p>
          <p className="pcard__meta">
            <span>Optional price</span>
          </p>
        </div>
      </div>
    );
  }

  const price = formatPrice(product.salePrice ?? product.price);
  const original = product.salePrice != null ? formatPrice(product.price) : null;

  return (
    <button
      className="pcard"
      onClick={() => onSelect?.(product)}
      aria-label={`View details for ${product.name}`}
    >
      <div className="pcard__imgwrap">
        <Badge product={product} />
        <img
          className="pcard__img"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src.indexOf(FALLBACK_IMAGE) === -1) {
              e.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />
        <span className="pcard__view">VIEW DETAILS</span>
      </div>
      <div className="pcard__body">
        {product.brand && <p className="pcard__brand">{product.brand}</p>}
        <p className="pcard__name">{product.name}</p>
        <p className="pcard__meta">
          <span>{getCategoryLabel(product.category)}</span>
          {product.size && <span>· {product.size}</span>}
          {price && (
            <span className="pcard__price">
              {original && <s>{original}</s>}
              {price}
            </span>
          )}
        </p>
      </div>
    </button>
  );
}
