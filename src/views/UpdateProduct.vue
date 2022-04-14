<template>
    <div align="center">
        <el-card style="width: 1000px" shadow="never">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="填写商品信息"></el-step>
                <el-step title="填写库存信息"></el-step>
            </el-steps>

            <div>
                <product-info-detail
                        v-show="showStatus[0]"
                        v-model="productParam"
                        :value="productParam"
                        :is-edit="true"
                        @nextStep="nextStep">
                </product-info-detail>
            </div>
            <div>
                <product-sku-detail
                        v-show="showStatus[1]"
                        v-model="productParam"
                        :value="productParam"
                        :is-edit="true"
                        @prevStep="prevStep"
                        @finishCommit="finishCommit">
                </product-sku-detail>
            </div>
        </el-card>
    </div>
</template>

<script>
    import ProductInfoDetail from "./product/ProductInfoDetail.vue";
    import ProductSkuDetail from "./product/ProductSkuDetail.vue";
    import {getProductById, updateProduct, addProduct} from "../api/product";
    import {useRoute, useRouter} from "vue-router";
    import {addOrUpdateSkus, getSkuList} from "../api/sku";
    import {getAttrList} from "../api/attr";

    export default {
        name: "ProductDetails",
        components: {ProductSkuDetail, ProductInfoDetail},

        data() {
            return {
                isEdit:false,
                active: 0,
                productParam: {
                    product: {},
                    skus: [],
                    attrs: []
                },
                showStatus: [true, false]
            }
        },
        created() {
            let id = useRoute().query.id
            console.log(id)
            getProductById(id).then(res => {
                this.productParam.product = res
            });

            getSkuList(id).then(res => {
                this.productParam.skus = res

            })
            console.log(this.productParam)
        },
        methods: {
            hideAll() {
                for (let i = 0; i < this.showStatus.length; i++) {
                    this.showStatus[i] = false;
                }
            },
            prevStep() {
                if (this.active > 0 && this.active < this.showStatus.length) {
                    this.active--;
                    this.hideAll();
                    this.showStatus[this.active] = true;
                }
            },
            nextStep() {
                if (this.active < this.showStatus.length - 1) {
                    this.active++;
                    this.hideAll();
                    this.showStatus[this.active] = true;
                }
            },
            finishCommit(isEdit) {
                this.$confirm('是否要提交该产品', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (isEdit) {

                        updateProduct(this.productParam).then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '提交成功',
                                    duration: 1000
                                });
                                this.$router.back();
                        });
                    } else {
                        //console.log(this.productParam)
                        addProduct(this.productParam).then(response => {
                            this.$message({
                                type: 'success',
                                message: '提交成功',
                                duration: 1000
                            });
                            location.reload();
                        });
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>
