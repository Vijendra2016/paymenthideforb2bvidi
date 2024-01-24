// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").HideOperation} HideOperation
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {

  const purchasingCompany = input.cart.buyerIdentity?.purchasingCompany?.company.id;

  const deferred_method = input.paymentMethods.find((method) =>
    method.name.includes("Deferred")
  );
  if(!purchasingCompany || !deferred_method){
    console.log('checkout is not b2b with pament terms. No changes')
    return NO_CHANGES;
  }

  const all_payment_methods_except_deferred = input.paymentMethods.filter((method) =>
    !method.name.includes("Deferred")
  );
  const hide_operations = all_payment_methods_except_deferred.map((method) => {
    return {
      hide: {
        paymentMethodId: method.id,
      },
    };
  });
  console.log('hide_operations', hide_operations)

  console.log('checkout is b2b with pament terms. Hiding all other payment methods')
  return {
    operations:
    [
      {
        rename: {
          paymentMethodId: deferred_method.id,
          name: "Dealer Default Method"
        }
      },
      ...hide_operations
    ]
  }
};
