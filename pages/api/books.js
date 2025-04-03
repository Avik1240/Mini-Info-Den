import dbConnect from '../../lib/dbConnect';
import Book from '../../models/Book';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { vendorId, query } = req.query;

    try {
      // ✅ Fetch books ONLY for the specified vendor
      const filter = vendorId ? { vendor: vendorId } : {};
      
      // ✅ Include search functionality if `query` is provided
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
        ];
      }

      const books = await Book.find(filter).populate('vendor', 'name email');

      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
  } else if (req.method === 'POST') {
    const { title, author, price, rentalFee, securityDeposit, stock, vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    try {
      const book = new Book({
        title,
        author,
        price,
        rentalFee,
        securityDeposit,
        stock,
        vendor: vendorId, 
      });

      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error adding book', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
