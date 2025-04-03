import dbConnect from '../../lib/dbConnect';
import Book from '../../models/Book';
import Vendor from '../../models/Vendor';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { query } = req.query;
    try {
      const books = await Book.find({
        $or: [
          { title: { $regex: query || '', $options: 'i' } },
          { author: { $regex: query || '', $options: 'i' } },
        ],
      }).populate('vendor', 'name email'); // ✅ Populating vendor details
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  } else if (req.method === 'POST') {
    const { title, author, price, rentalFee, securityDeposit, stock, vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    // ✅ Ensure the vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(403).json({ message: 'Invalid vendor' });
    }

    try {
      const book = new Book({
        title,
        author,
        price,
        rentalFee,
        securityDeposit,
        stock,
        vendor: vendorId, // ✅ Associating book with vendor
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
