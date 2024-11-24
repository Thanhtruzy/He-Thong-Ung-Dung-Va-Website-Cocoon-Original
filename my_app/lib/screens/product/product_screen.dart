import 'package:flutter/material.dart';
import 'package:my_app/models/category_model.dart';
import 'package:my_app/theme/color.dart';
import 'package:my_app/screens/product/components/product_body.dart';
import '../../models/popular_model.dart';

class ProductScreen extends StatelessWidget {
  final Category category;
  final List<Popular>? searchResults;

  const ProductScreen({
    Key? key,
    required this.category,
    this.searchResults,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: BackgroundColor,
      appBar: buildAppBar(context),
      body: Padding(
        padding: const EdgeInsets.only(
          left: 12.0,
          right: 12.0,
        ),
        child: Column(
          children: [
            Expanded(
              child: searchResults != null && searchResults!.isNotEmpty
                  ? ProductBody(size: size, products: searchResults!, categoryId: '')
                  : ProductBody(size: size, categoryId: category.categoryId),
            ),
          ],
        ),
      ),
    );
  }

  AppBar buildAppBar(context) {
    return AppBar(
      backgroundColor: BackgroundColor,
      elevation: 0.0,
      toolbarHeight: 80.0,
      title: const Text(
        'Sản Phẩm',
        style: TextStyle(
          fontSize: 20,
          color: textColor,
          fontWeight: FontWeight.w500,
        ),
      ),
      centerTitle: true,
      leading: IconButton(
        onPressed: (() {
          Navigator.pop(context);
        }),
        icon: const Icon(
          Icons.arrow_back_ios,
          color: textColor,
        ),
      ),
      actions: [
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: TextLightColor,
          ),
          margin: const EdgeInsets.all(5),
          child: Center(
            child: IconButton(
              onPressed: (() {
                // Add any additional actions here if needed
              }),
              icon: const Icon(
                Icons.person,
                size: 30,
                color: textColor,
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
      ],
    );
  }
}