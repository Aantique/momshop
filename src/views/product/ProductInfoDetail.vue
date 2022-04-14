<template>
    <div style="margin-top: 50px;">
        <el-form :model="value.product" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px"
                 size="small">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="value.product.name"></el-input>
            </el-form-item>
            <el-form-item label="商品模糊名" prop="keyWords">
                <el-input v-model="value.product.keyWords"></el-input>
            </el-form-item>

            <el-form-item label="商品品牌" prop="brandId">
                <el-select v-model="value.product.brandId" placeholder="品牌" class="handle-select mr10">
                    <el-option v-for="item in brands"
                               :key="item.id" :label="item.name" :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-input v-model="value.product.price"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {getProductById, updateProduct} from "../../api/product";
    import {getBrands} from "../../api/brand";
    import {getCategories} from "../../api/category";

    export default {
        name: "productInfoDetail",
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                product: {},
                brands: [],
                rules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                    ],
                    /*keyWords: [{required: true, message: '请输入商品模糊名', trigger: 'blur'}],*/
                    categoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
                    brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
                    price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
                }
            }
        },

        created() {
            this.getCatesAndBrands()
        },
        computed: {
            productId() {
                return this.product.id;
            }
        },

        methods: {
            getCatesAndBrands() {
                getBrands().then(res => {
                    this.brands = res;
                })
            },

            handleNext(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('nextStep');
                    } else {
                        this.$message({
                            message: '验证失败',
                            type: 'error',
                            duration: 1000
                        });
                        return false;
                    }
                });
            }
        }

    }
</script>

<style scoped>

</style>
