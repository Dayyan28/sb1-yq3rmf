export const products = [
  {
    id: 1,
    name: "T-Shirt",
    price: 299.99,
    image: "https://media.istockphoto.com/id/465485415/photo/blue-t-shirt-clipping-path.jpg?s=1024x1024&w=is&k=20&c=aHSQPbV7yEYB-xhrf2mwBaSZlSxNdXiaO5KliStWEYg=",
    sku: "TS001",
    quantity: 1,
    pricePerUnit: 299.99
  },
  {
    id: 2,
    name: "Jeans",
    price: 749.99,
    image: "https://media.istockphoto.com/id/137308430/photo/dark-blue-designer-jeans-for-men-white-background.jpg?s=1024x1024&w=is&k=20&c=MQuqBQVKiO6cDZRCksMQeoy-jzcSAabECTq9L0z3eNc=",
    sku: "JN001",
    quantity: 1,
    pricePerUnit: 749.99
  },
  {
    id: 3,
    name: "Sneakers",
    price: 1199.99,
    image: "https://media.istockphoto.com/id/1249496770/photo/running-shoes.jpg?s=1024x1024&w=is&k=20&c=pvn3pnD5rbSz7LT1zbCkgMd6PyEXeo7QdzjDCRNHunI=",
    sku: "SN001",
    quantity: 1,
    pricePerUnit: 1199.99
  },
  {
    id: 4,
    name: "Hat",
    price: 224.99,
    image: "https://media.istockphoto.com/id/184393541/photo/multicoloured-party-hats-isolated-on-white-background-studio-shot.jpg?s=1024x1024&w=is&k=20&c=R6DEVWhin8SfkwGTzhczw3YsAGNtky0g4krk2_6qUQs=",
    sku: "HT001",
    quantity: 1,
    pricePerUnit: 224.99
  },
  {
    id: 5,
    name: "Socks",
    price: 149.99,
    image: "https://media.istockphoto.com/id/469935261/photo/striped-socks.jpg?s=1024x1024&w=is&k=20&c=CYWk_-FCT4G8JiP8-i2VdseH9EDZ50fOrj0viCja26Y=",
    sku: "SK001",
    quantity: 1,
    pricePerUnit: 149.99
  },
  {
    id: 6,
    name: "Other",
    price: 0,
    image: "https://via.placeholder.com/80x80/808080/FFFFFF?text=Other",
    sku: "OT001",
    quantity: 1,
    pricePerUnit: 0,
    isCustom: true
  }
]

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}