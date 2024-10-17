const orderService = require('../services/order'); 

async function getAbout(req, res)  {
    res.render('about.ejs');
}

async function salesGraphData(req, res) {    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Get date 6 days ago
    startDate.setHours(0, 0, 0, 0); // Set time to midnight

    // Fetch all orders in a single query for the last 7 days
    const orders = await orderService.getOrdersInTimeRange(startDate, new Date());
    const salesByDay = {};

    // Create an array of all dates we need
    const allDates = [];
    for (let i = 0; i <= 6; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const monthNumber = (date.getMonth() + 1).toString().padStart(2, '0');
        const dayNumber = date.getDate().toString().padStart(2, '0');
        const dateString = `${dayNumber}/${monthNumber}`;
        allDates.push(dateString);
        salesByDay[dateString] = 0; // Initialize all dates with 0
    }

    // Sum up the actual sales
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const monthNumber = (orderDate.getMonth() + 1).toString().padStart(2, '0');
        const dayNumber = orderDate.getDate().toString().padStart(2, '0');
        const dateString = `${dayNumber}/${monthNumber}`;
        
        salesByDay[dateString] += order.total_price;
    });
    
    // Convert to array and ensure correct order
    const result = allDates.map(date => ({
        date,
        sales: salesByDay[date]
    }));

    res.json(result);
}


async function themeGraphData(req, res) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Get date 6 days ago
    startDate.setHours(0, 0, 0, 0); // Set time to midnight

    const orders = await orderService.getOrdersInTimeRange(startDate, new Date());
    const itemsPerTheme = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            try {

                if (item.item){
                    if (!itemsPerTheme[item.item.theme])
                    itemsPerTheme[item.item.theme] = 0;

                    itemsPerTheme[item.item.theme] += 1 * item.quantity;    
                }
                
                
            } catch (e) {

            }
            
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
    salesGraphData,
    themeGraphData
};