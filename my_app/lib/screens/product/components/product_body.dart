import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart'; // Import the package
import 'package:my_app/theme/color.dart';
import 'package:my_app/screens/product/components/product_item.dart';
import 'package:my_app/models/popular_model.dart';
import 'package:my_app/services/api_service.dart';
import '../../details_screen/details_screen.dart';

class ProductBody extends StatefulWidget {
  const ProductBody({
    super.key,
    required this.size,
    required this.categoryId,
    this.products,
  });

  final Size size;
  final List<Popular>? products;
  final String categoryId;

  @override
  _ProductBodyState createState() => _ProductBodyState();
}

class _ProductBodyState extends State<ProductBody> {
  List<Popular> products = []; // List of products

  @override
  void initState() {
    super.initState();
    fetchProducts(widget.categoryId); // Fetch products based on categoryId
  }

  Future<void> fetchProducts(String categoryId) async {
    List<Popular> fetchedProducts = await ApiService.getProductsByCategoryId(categoryId);
    setState(() {
      products = fetchedProducts.cast<Popular>(); // Update the list of products
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          // Staggered grid for products
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: StaggeredGridView.countBuilder(
              itemCount: products.length,
              crossAxisCount: 2,
              itemBuilder: (context, index) {
                return ProductItem(
                  product: products[index],
                  onTap: () {
                    // Navigate to the DetailsScreen on tap
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => DetailsScreen(detail: products[index]),
                      ),
                    );
                  },
                );
              },
              staggeredTileBuilder: (index) => StaggeredTile.fit(1), // You can modify this to adjust the size of each tile
              mainAxisSpacing: 16.0,
              crossAxisSpacing: 16.0,
            ),
          ),
        ),
      ],
    );
  }
}
