import React, { useState, useEffect } from 'react';
import AdminMenu from './../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import FooterOnly from '../../components/Layout/FooterOnly/FooterOnly';
const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [photo, setPhoto] = useState('');
    const [id, setId] = useState('');

    //get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setShipping(data.product.shipping);
            setCategory(data.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getSingleProduct();
        //eslint-disable-next-line
    }, []);
    //get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category');
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi xem danh mục');
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    //create product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('quantity', quantity);
            photo && productData.append('photo', photo);
            productData.append('category', category);
            const { data } = axios.put(`/api/v1/product/update-product/${id}`, productData);
            if (data?.success) {
                toast.error(data?.message);
            } else {
                toast.success('Sửa sản phẩm thành công');
                navigate('/dashboard/admin/products');
            }
        } catch (error) {
            console.log(error);
            toast.error('Lỗi sửa sản phẩm');
        }
    };

    //delete a product
    const handleDelete = async () => {
        try {
            let answer = window.prompt('Bạn có thực sự muốn xóa sản phẩm ');
            if (!answer) return;
            // eslint-disable-next-line no-unused-vars
            const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
            toast.success('Xóa sản phẩm thành công');
            navigate('/dashboard/admin/products');
        } catch (error) {
            console.log(error);
            toast.error('Lỗi xóa sản phẩm');
        }
    };
    return (
        <FooterOnly title={'Cập nhật sản phẩm | Sopi VN'}>
            <div className="container-fluid m-5 p-5">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div>
                            <h1>Update Product</h1>
                            <div className="m-1 w-75">
                                <Select
                                    bordered={false}
                                    placeholder="Chọn danh mục"
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    onChange={(value) => {
                                        setCategory(value);
                                    }}
                                    value={category}
                                >
                                    {categories?.map((c) => (
                                        <Option key={c._id} value={c._id}>
                                            {c.name}
                                        </Option>
                                    ))}
                                </Select>
                                <div className="mb-3">
                                    <label className="btn btn-outline-secondary col-md-12">
                                        {photo ? photo.name : 'Tải ảnh lên'}
                                        <input
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            onChange={(e) => setPhoto(e.target.files[0])}
                                            hidden
                                        />
                                    </label>
                                </div>
                                <div className="mb-3">
                                    {photo ? (
                                        <div className="text-center">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt="product_photo"
                                                height={'200px'}
                                                className="img img-responsive"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <img
                                                src={`/api/v1/product/product-photo/${id}`}
                                                alt="product_photo"
                                                height={'200px'}
                                                className="img img-responsive"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={name}
                                        placeholder="Nhập tên sản phẩm"
                                        className="form-control"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        type="text"
                                        value={description}
                                        placeholder="Mô tả"
                                        className="form-control"
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="number"
                                        value={price}
                                        placeholder="Giá"
                                        className="form-control"
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="number"
                                        value={quantity}
                                        placeholder="Số lượng"
                                        className="form-control"
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <Select
                                        bordered={false}
                                        placeholder="Chọn vận chuyển "
                                        size="large"
                                        showSearch
                                        className="form-select mb-3"
                                        onChange={(value) => {
                                            setShipping(value);
                                        }}
                                        value={shipping ? 'yes' : 'No'}
                                    >
                                        <Option value="0">Không</Option>
                                        <Option value="1">Có</Option>
                                    </Select>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-primary" onClick={handleUpdate}>
                                        Sửa sản phẩm
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-danger" onClick={handleDelete}>
                                        Xóa sản phẩm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FooterOnly>
    );
};

export default UpdateProduct;