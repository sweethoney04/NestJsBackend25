<script setup lang="ts">
    import { onMounted, reactive } from 'vue';
    import { CourseCategoryComposible } from './composible/index';
    import { message } from 'ant-design-vue';

    const { fetchAll, deleteItem } = CourseCategoryComposible();

    const columns = [
        {
            title: 'No',
            dataIndex: 'id',
            key: 'no',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
        },
    ]

    const data = reactive<any>({
        categories: []
    });

    const onDelete = async (id: number) => {
        try {
            await deleteItem(id);
            message.success('Customer deleted successfully');
            await fetchAll();
        } catch (err: unknown) {
            console.log(err);
        }
    }

    onMounted(async() => {
        const respone = await fetchAll();
        data.categories = respone.data;
    })
</script>

<template>
    <div>
        <a-table :dataSource="data.categories" :columns="columns">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'no'">
                   {{ index+1 }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-popconfirm
                        v-if="data.categories.length"
                        title="Sure to delete?"
                        @confirm="onDelete(record.id)"
                    >
                        <a>Delete</a>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
    </div>
</template>

<style lang="scss" scoped>

</style>