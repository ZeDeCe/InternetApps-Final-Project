const orderService = require('../services/order'); 

async function getAbout(req, res)  {
    res.render('about.ejs');
}

async function firstGraphData(req, res) {    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Get date 6 days ago
    startDate.setHours(0, 0, 0, 0); // Set time to midnight

    // Fetch all orders in a single query for the last 7 days
    const orders = await orderService.getOrdersInTimeRange(startDate, new Date());
    const salesByDay = {};

    orders.forEach(order => {
        const orderDate = new Date(order.date);

        const monthNumber = (orderDate.getMonth() + 1).toString().padStart(2, '0');
        const dayNumber = orderDate.getDate().toString().padStart(2, '0');

        if (!salesByDay[`${dayNumber}/${monthNumber}`]) 
            salesByDay[`${dayNumber}/${monthNumber}`] = 0;
        
        salesByDay[`${dayNumber}/${monthNumber}`] += order.total_price;
    });
    
    const result = Object.entries(salesByDay)
    .sort(([dateA], [dateB]) => {
        // Split the dates into [day, month]
        const [dayA, monthA] = dateA.split('/').map(Number);
        const [dayB, monthB] = dateB.split('/').map(Number);

    return monthA - monthB || dayA - dayB;
    })
    .map(([date, sales]) => ({
        date,
        sales
    }));

    res.json(result);
}


async function secondGraphData(req, res) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Get date 6 days ago
    startDate.setHours(0, 0, 0, 0); // Set time to midnight

    const orders = await orderService.getOrdersInTimeRange(startDate, new Date());
    const itemsPerTheme = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            if (!itemsPerTheme[item.item.theme])
                itemsPerTheme[item.item.theme] = 0;

            itemsPerTheme[item.item.theme] += 1 * item.quantity;
        })
    });

    const result = Object.entries(itemsPerTheme).map(([theme, quantity]) => ({
        theme,
        quantity
    }));

   res.json(result);

}

module.exports = {
    getAbout,
    firstGraphData,
    secondGraphData
};