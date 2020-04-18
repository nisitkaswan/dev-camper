const advancedResults = (model, populate) => async (req, res, next) => {

    let query;

    const reqQuery = { ...req.query };

    // Fields to exclude

    const removeFields = ['select', 'sort', 'limit', 'page'];

    // Loop over removeFields and delete them

    removeFields.forEach(param => delete reqQuery[param]);

    // create query string
    let queryString = JSON.stringify(reqQuery);

    // create operators
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryString)).populate('courses');


    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination

    const page = parseInt(req.query.page, 10) || 1;

    const limit = parseInt(req.query.limit, 10) || 100;

    const startIndex = (page - 1) * limit;

    const endIndex = page * limit;

    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const results = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next =
        {
            page: page + 1,
            limit
        };
    }


    if (startIndex > 0) {
        pagination.prev =
        {
            page: page - 1,
            limit
        };
    }

    if (populate) {
        query = query.populate(populate);
    }

    res.advancedResults =
    {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();

}

module.exports = advancedResults;