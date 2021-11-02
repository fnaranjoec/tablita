import UsersService from "#root/adapters/UsersService";

const deleteCustomerResolver = async (obj, {customer_id}) => {

  return await UsersService.deleteCustomer({customer_id});

};

export default deleteCustomerResolver;

