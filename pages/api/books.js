import dbConnect from '../../lib/dbConnect';
import Book from '../../models/Book';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { vendorId, query } = req.query;

    try {
      const filter = vendorId ? { vendor: vendorId } : {};

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
  } 
  else if (req.method === 'POST') {
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
  } 
  else if (req.method === 'DELETE') {
    const { bookId } = req.body; // Get book ID from request body

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    try {
      const deletedBook = await Book.findByIdAndDelete(bookId);
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }

      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
  } 
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
