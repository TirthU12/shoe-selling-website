
const express = require('express')
const routes = express.Router()
const Product = require('../models/produces.models')

routes.post('/add-product', async (req, res) => {
    try {
        const product = new Product(req.body)
        const newProduct = await product.save()
        res.status(201).json({ message: "Product added", data: newProduct });
    } catch (error) {
        res.status(400).json({ message: error.message })

    }
})
routes.get('/get-color/:pn',async(req,res)=>{
    try {
        console.log(req.params.pn)
        const fetchColor=await Product.find(
            {
                 product_name: { $regex: `^${req.params.pn}$`, $options: 'i' }
            },
            {
                _id:1,
                images:1
            }
        );
        if(!fetchColor){
            console.log("Error Fetching Data")
            return
        }
       
        res.status(200).json(fetchColor)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})
routes.get('/view-product', async (req, res) => {
    try {
        // Get one product per product_name (only one color per product name)
        const fetchProduct = await Product.aggregate([
            {
                // Match only valid documents
                $match: {
                    product_name: { $exists: true, $ne: null }
                }
            },
            {
                // Sort to get consistent results (newest first)
                $sort: { createdAt: -1 }
            },
            {
                // Group by product_name only
                $group: {
                    _id: '$product_name',
                    doc: { $first: '$$ROOT' }
                }
            },
            {
                // Filter out any null documents
                $match: {
                    doc: { $ne: null }
                }
            },
            {
                // Replace with the actual document
                $replaceRoot: { newRoot: '$doc' }
            },
            {
                // Sort by brand and product name
                $sort: { brand: 1, product_name: 1 }
            }
        ]);

        res.json(fetchProduct);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(400).json({ message: error.message });
    }
});

routes.get('/view-one-product/:id',async(req,res)=>{
    try {
        const fetch_one_product=await Product.findById(req.params.id)
        if(!fetch_one_product){
            res.status(404).json({message:"Product Not Found"})
            return
        }
        res.status(201).json(fetch_one_product)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

routes.delete('/delete-product/:id',async(req,res)=>{
    try {
        const deleteProduct=await Product.findByIdAndDelete(req.params.id)
        if(!deleteProduct){
            res.status(404).json({message:'Product Not Found'})
            return
        }
        res.json({message:"Product Deleted"})

    } catch (error) {
         res.status(505).json({message:error.message})
    }
})
routes.put('/update-product/:id',async(req,res)=>{
    try {
        const UpdateProduct=await Product.findByIdAndUpdate(req.params.id,
            req.body,
            {new:true}
        )
        if(!UpdateProduct){
            res.status(404).json({message:'Product Not Found'})
            return
        }
        res.json({message:"Product Updated"})

    } catch (error) {
        res.status(505).json({message:error.message})
    }
})

routes.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(200).json({ success: true, products: [] });
        }

        const query = q.trim().toLowerCase();

       
        const brands = await Product.distinct('brand');

      
        let matchedBrand = null;
        let brandMatchScore = 0;

        for (const brand of brands) {
            const brandLower = brand.toLowerCase();
            
           
            if (query === brandLower) {
                matchedBrand = brand;
                brandMatchScore = 100;
                break;
            }
            
           
            if (query.includes(brandLower)) {
                const score = brandLower.length;
                if (score > brandMatchScore) {
                    matchedBrand = brand;
                    brandMatchScore = score;
                }
            }
            
            
            if (brandLower.includes(query)) {
                const score = (query.length / brandLower.length) * 50;
                if (score > brandMatchScore) {
                    matchedBrand = brand;
                    brandMatchScore = score;
                }
            }

           
            const queryWords = query.split(/\s+/);
            const brandWords = brandLower.split(/\s+/);
            
            for (const qWord of queryWords) {
                for (const bWord of brandWords) {
                    if (qWord && bWord && (qWord === bWord || qWord.includes(bWord) || bWord.includes(qWord))) {
                        const score = Math.min(qWord.length, bWord.length);
                        if (score > brandMatchScore) {
                            matchedBrand = brand;
                            brandMatchScore = score;
                        }
                    }
                }
            }
        }

        let products;

        if (matchedBrand && brandMatchScore > 2) {
           
            const remainingQuery = query
                .replace(matchedBrand.toLowerCase(), '')
                .trim();

            if (remainingQuery) {
            
                products = await Product.find({
                    $and: [
                        { brand: { $regex: matchedBrand, $options: 'i' } },
                        {
                            $or: [
                                { product_name: { $regex: remainingQuery, $options: 'i' } },
                                { description: { $regex: remainingQuery, $options: 'i' } },
                                { category: { $regex: remainingQuery, $options: 'i' } },
                                { color: { $regex: remainingQuery, $options: 'i' } }
                            ]
                        }
                    ]
                }).limit(20);
            } else {
               
                products = await Product.find({
                    brand: { $regex: matchedBrand, $options: 'i' }
                }).limit(20);
            }
        } else {
          
            const searchWords = query.split(/\s+/).filter(word => word.length > 0);
            
            products = await Product.find({
                $or: [
                    { product_name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { color: { $regex: query, $options: 'i' } },
                    
                    ...searchWords.map(word => ({
                        product_name: { $regex: word, $options: 'i' }
                    }))
                ]
            }).limit(20);
        }

    
        if (!products || products.length === 0) {
            products = await Product.aggregate([
                { $sample: { size: 20 } }
            ]);
        }

        return res.status(200).json({
            success: true,
            products,
            matchedBrand: matchedBrand || undefined,
            isRandomResults: (!products || products.length === 0) ? false : !matchedBrand && products.length > 0
        });

    } catch (error) {
        console.error('Error searching products:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});


module.exports = routes