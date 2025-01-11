import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";


//@desc Create new order
//@routePOST/api/orders
//@acess private 
const addOrderItems = asyncHandler(async (req,res) => {
   const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
   } = req.body;

   if(orderItems && orderItems.length === 0){
    res.status(400);
    throw new Error('No irder items');
   }else{
    const order = new Order({
        orderItems:orderItems.map((x) => ({
            ...x,
            product:x._id,
            _id: undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
   }
});

//@desc Get logged in user orders
//@route GET/api/orders/myorders
//@acess private
const getMyOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find({user: req.user._id});
    res.status(200).json(orders);
 }); 

 //@desc Get Order by ID
//@route GET/api/orders/:id
//@acess Private
const getOrderById= asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user','name email');

    if(order){
        res.status(200).json(order);
    }else{
        res.status(400);
        throw new Error('Order not found');
    }
 }); 



 //@desc Update Order to paid
//@route PUT/api/orders/:id/pay
//@acess Private
const updateOrderToPaid = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_address: req.body.payer.email_address,

        };
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }else{
        res.status(404);
        throw new Error('Order not found');
    }
 }); 
 

 //@desc Update Order to delivered
//@route PUT/api/orders/:id/deliver
//@acess Private/Admin
const updateOrderToDelivered = asyncHandler(async (req,res) => {
    return res.send('update order to delivered');
   const order = await Order.findById(req.params.id);

   if(order){
     order.isDelivered  = true;
     order.deliveredAt = Date.now();
     const updatedOrder = await order.save();
     res.status(200).json(updatedOrder);
   }else{
    res.status(404);
    throw new Error('Order not found');
   }
 }); 


 //@desc Get all orders
//@route GET/api/orders
//@acess Private/Admin
const getOrders = asyncHandler(async (req,res) => {
    res.send('get all orders');
 }); 

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
};