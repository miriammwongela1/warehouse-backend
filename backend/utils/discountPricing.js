export const getDiscountedPrice = (product, settings, now = new Date()) => {
  const daysLeft = Math.ceil(
    (new Date(product.priceExpiryDate) - now) / (1000 * 60 * 60 * 24)
  );

  if (
    settings.expiryDiscountThreshold > 0 &&
    daysLeft <= settings.expiryDiscountThreshold &&
    daysLeft >= 0
  ) {
    return product.price - (product.price * settings.discountRate) / 100;
  }

  return null;
};
