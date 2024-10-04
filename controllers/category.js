const categoryService = require('../services/category'); // Assuming your service is in a services folder

exports.getFilteredCategories = async (req, res) => {
    try {
        const filters = {
            name: req.query.search || '',
            minPrice: req.query.minPrice || 0,
            maxPrice: req.query.maxPrice || 9999999,
            theme: req.query.theme ? req.query.theme.split(',') : [], // Assuming themes are sent as a comma-separated string
            minPieces: req.query.minPieces || 0,
            maxPieces: req.query.maxPieces || 9999999,
        };

        // Call service function with filters
        const data = await categoryService.searchProductsByFilters(filters);

        // Send back the filtered data
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};