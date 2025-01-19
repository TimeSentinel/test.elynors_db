/* ---------------------------------------
src/modules/Products/Test.tsx
PROJECT: elynors;

(c) 2025 Lance Stubblefield 
--------------------------------------- */
import useSWR from "swr";
import "./products.css"

interface ProductInteface {
    productid: string;
    productname: string;
    productshort: string;
    productdesc: string;
    productprice: number;
    productimage: string;
    producttags: string;
    catname: string;
    subcatname: string;
}

interface CategoryInterface {
    catid: string;
    catname: string;
    catdesc: string;
    catavail: string;
}

interface SubcatInterface {
    subcatid: string;
    subcatname: string;
}

function ProductsMenu() {
    const fetcher =
        ({url, init}: { url: RequestInfo | URL, init?: RequestInit }) =>
            fetch(url, init).then((res) => res.json());
    const {
        data: products,
        error: prodError,
        isValidating: prodValidate,
    } = useSWR({url: "http://localhost:3001/?query=products", init: {method: "GET"}}, fetcher);
    const {
        data: categories,
        error: catError,
        isValidating: catValidate,
    } = useSWR({url: "http://localhost:3001/?query=categories", init: {method: "GET"}}, fetcher);
    const {
        data: subcats,
        error: subError,
        isValidating: subValidate,
    } = useSWR({url: "http://localhost:3001/?query=subcats", init: {method: "GET"}}, fetcher);
    if (prodValidate || catValidate || subValidate) return <div className="loading">Loading menu items...</div>;
    if (prodError) return <div className="failed">Failed to load the products</div>;
    if (catError) return <div className="failed">Failed to load the categories</div>;
    if (subError) return <div className="failed">Failed to load the subcats</div>;

    return (
        <div className="productsContainer">
            {categories &&
                categories.map((category: CategoryInterface) => {
                    return (
                        <div key={category.catid}>
                            <div
                                className="productCategory text-very-dark-color background-light-shade border-dark-color">
                                {category.catname} <span className="catAvail">{category.catavail}</span>
                            </div>
                            {subcats &&
                                subcats.map((subcat: SubcatInterface) => {
                                    if (products.filter((product: ProductInteface) => product.catname === category.catname && product.subcatname === subcat.subcatname)
                                        .length > 0) {
                                        return (
                                            <div key={subcat.subcatid}>
                                                <div className="productSubcat text-bright-color border-bright-color">
                                                    {subcat.subcatname}
                                                </div>
                                                {
                                                    products &&
                                                    products.map((product: ProductInteface) => {
                                                        if (product.catname === category.catname && product.subcatname === subcat.subcatname) {
                                                            return (

                                                                <div className="productCard border-soft-color">
                                                                    <div className="productThumb">
                                                                        <img src={product.productimage}
                                                                             alt="Food Thumbnail"/>
                                                                    </div>
                                                                    <div className="productInfo">
                                                                        <div className="productTitleRow">
                                                                            <div
                                                                                className="productTitle text-dark-color">
                                                                                {product.productname}
                                                                            </div>
                                                                            <div
                                                                                className="productShort text-medium-color">
                                                                                {product.productshort}
                                                                            </div>
                                                                            <div
                                                                                className="productPrice text-dark-color">
                                                                                ${product.productprice}
                                                                            </div>
                                                                        </div>
                                                                        <div className="productDesc text-dark-color">
                                                                            {product.productdesc}<br/>
                                                                            <span
                                                                                className="productTags text-medium-color">{product.producttags}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                            </div>
                                        )
                                    }
                                })}
                        </div>
                    )
                })}
        </div>
    )
}

export default ProductsMenu;