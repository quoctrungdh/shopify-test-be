const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

const { adminRequest, storeFrontRequest, restAdmin } = require("./request");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 2053;

app.post("/gift-with-purchase", async (req, res) => {
  try {
    const bxgyDiscountsQuery = `{
      automaticDiscountNodes(first: 10) {
        edges {
          node {
            id
            automaticDiscount {
              ... on DiscountAutomaticBxgy {
                status
                title
                summary
                customerBuys {
                  items {
                    __typename
                    ... on DiscountCollections {
                      collections (first: 10) {
                        edges {
                          node {
                            id
                            handle
                            
                          }
                        }
                      }
                    }
                  }
                  value {
                    ... on DiscountPurchaseAmount {
                      amount
                    }
                  }
                }
                
                customerGets {
                  items {
                    ... on DiscountProducts {
                      products (first: 1) {
                        edges {
                          node {
                            id
                            variants (first: 5) {
                              edges {
                                node {
                                  id
                                  displayName
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    `;
    const { data } = await adminRequest.post("", bxgyDiscountsQuery);
    const discounts = data.data.automaticDiscountNodes.edges;

    const discountAmountGift = discounts.map((dicount) => {
      const { node } = dicount;
      const { customerBuys, customerGets } = node.automaticDiscount;
      return {
        id: node.id,
        collection: customerBuys.items.collections.edges[0].node.handle,
        amount: customerBuys.value.amount,
        giftId: customerGets.items.products.edges[0].node.variants.edges[0].node.id,
        title: customerGets.items.products.edges[0].node.variants.edges[0].node.displayName,
      };
    });

    const cartCollectionAmount = req.body;

    const gifts = cartCollectionAmount.reduce((prev, cartItem) => {
      const applicableDiscount = discountAmountGift.find((discount) => {
        const isInCollection = discount.collection === cartItem.collection;
        const hasGreaterAmount = cartItem.amount >= discount.amount;
        return isInCollection && hasGreaterAmount;
      });
      if (applicableDiscount) {
        console.log(applicableDiscount);
        return prev.concat(applicableDiscount);
      }
      return prev;
    }, []);

    res.send(gifts);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
