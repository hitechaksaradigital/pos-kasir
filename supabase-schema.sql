CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON products FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert access"
  ON products FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON products FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public delete access"
  ON products FOR DELETE TO public USING (true);

INSERT INTO products (name, price, image, category) VALUES
('Produk 1', 45.00, 'https://images.pexels.com/photos/32885654/pexels-photo-32885654.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Apparel'),
('Quantum Run V2', 120.00, 'https://images.pexels.com/photos/2364580/pexels-photo-2364580.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Footwear'),
('Heritage Denim Jacket', 89.99, 'https://images.pexels.com/photos/18533669/pexels-photo-18533669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Apparel'),
('Precision Chronograph', 250.00, 'https://images.pexels.com/photos/9261531/pexels-photo-9261531.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Accessories'),
('Merino Wool Beanie', 35.00, 'https://images.pexels.com/photos/8219320/pexels-photo-8219320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Accessories'),
('Ultra Boost Sneakers', 180.00, 'https://images.pexels.com/photos/2364580/pexels-photo-2364580.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Footwear'),
('Wireless Earbuds Pro', 149.99, 'https://images.pexels.com/photos/9261531/pexels-photo-9261531.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Electronics'),
('Smart Fitness Band', 79.99, 'https://images.pexels.com/photos/9261531/pexels-photo-9261531.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Electronics');
