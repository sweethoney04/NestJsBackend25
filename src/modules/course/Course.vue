<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useCourse } from "./composible/index";
import type { ICourseEntity } from "./entity/course.entity";
import { h } from "vue";
import dayjs from "dayjs";

const {
  fetchItems,
  getAllTeachers,
  getallCategoires,
  createCourse,
  deleteCourse,
  updateStatusChange,
  updateCourse
} = useCourse();

const data = reactive<any>({
  courses: [],
  teachers: [],
  categories: [],
  isLoading: false,
});

/** Custom Columns */
const columns = [
  {
    title: "ລຳດັບ",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "ໝວດໝູ່",
    dataIndex: "category",
    key: "category",
    customRender: ({ record }: { record: ICourseEntity }) =>
      record.category?.name || "-",
  },
  {
    title: "ຫົວຂໍ້",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "ຮັບຈຳນວນ",
    dataIndex: "max_student",
    key: "max_student",
    customRender: ({ record }: { record: ICourseEntity }) => {
      const maxStudent = record.max_student ?? 0;
      return `${maxStudent} ຄົນ`;
    },
  },
  {
    title: "ຊົ່ວໂມງຮຽນ",
    dataIndex: "duration_hours",
    key: "duration_hours",
    customRender: ({ record }: { record: ICourseEntity }) => {
      const durationHours = record.duration_hours ?? 0;
      return `${durationHours} ຊົ່ວໂມງ`;
    },
  },
  {
    title: "ລາຄາ",
    dataIndex: "price",
    key: "price",
    customRender: ({ record }: { record: ICourseEntity }) => {
      const price = record.price ?? 0;
      return `${price.toLocaleString("lo-LA")} ກີບ`;
    },
  },
  {
    title: "ເປີດລົງທະບຽນ",
    dataIndex: "registration_start_date",
    key: "registration_start_date",
  },
  {
    title: "ປິດລົງທະບຽນ",
    dataIndex: "registration_end_date",
    key: "registration_end_date",
  },
  {
    title: "ເປີດຮຽນ",
    dataIndex: "start_date",
    key: "start_date",
  },
  {
    title: "ປິດຮຽນ",
    dataIndex: "start_date",
    key: "start_date",
  },
  {
    title: "ສະຖານະ",
    dataIndex: "status",
    key: "status",
    customRender: ({ record }: { record: ICourseEntity }) => {
      const status = record.status ?? "open";
      const color = status === "open" ? "green" : "red";
      const text = status === "open" ? "ເປີດ" : "ປິດ";

      return h(
        "span",
        {
          style: {
            color: color,
            fontWeight: "bold",
          },
        },
        text
      );
    },
  },
  {
    title: "Action",
    key: "action",
  },
];

/**
 * Fetch All Data
 * - Courses
 * - Teachers
 * - Categories
 */
const fetchAll = async () => {
  /** Get All Courses */
  const response = await fetchItems();
  data.courses = response.data;

  /** Get All Teachers */
  const teachers = await getAllTeachers();
  data.teachers = teachers.data.map((teacher: any) => ({
    value: teacher.id,
    label: teacher.user.username || "Unknown",
  }));

  /** Get All Categoies */
  const categories = await getallCategoires();
  data.categories = categories.data.map((category: any) => ({
    value: category.id,
    label: category.name || "Unknown",
  }));
};

onMounted(async () => {
  await fetchAll();
});

const isOpenModalAdd = ref(false);

const openModalAdd = () => {
  isOpenModalAdd.value = true;
};

const formState = reactive({
  teacher_id: "",
  category_id: "",
  title: "",
  max_students: 0,
  duration_hours: 0,
  price: 0,
  registration_start_date: "",
  registration_end_date: "",
  start_date: "",
  end_date: "",
  description: "",
});

const handleSubmit = async () => {
  try {
    await createCourse(formState);
    isOpenModalAdd.value = false;
    await fetchAll();
  } catch (error) {
    console.error("Error creating course:", error);
  }
};
const handleStatusChange = async (record: ICourseEntity, checked: boolean) => {
  const newStatus = checked ? "open" : "closed";
  try {
    await updateStatusChange(record.id, newStatus);
    await fetchAll();
  } catch (error) {
    console.error("Error updating course status:", error);
  }
};
const onDelete = async (id: number) => {
  try {
    await deleteCourse(id);
    await fetchAll();
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

const formStateEdit = reactive({
    id: 0,
    teacher_id: '',
    category_id: '',
    title: '',
    max_students: 0,
    duration_hours: 0,
    price: 0,
    registration_start_date: '',
    registration_end_date: '',
    start_date: '',
    end_date: '',
    description: ''
});
const isOpenModalEdit = ref(false);

const openEditModal = (record: ICourseEntity) => {
  formStateEdit.id = record.id;
  formStateEdit.teacher_id = record.teacher_id;
  formStateEdit.category_id = record.category_id;
  formStateEdit.title = record.title;
  formStateEdit.max_students = record.max_student;
  formStateEdit.duration_hours = record.duration_hours;
  formStateEdit.price = record.price;
  formStateEdit.registration_start_date = record.registration_start_date
    ? dayjs(record.registration_start_date).format("YYYY-MM-DD")
    : "";
  formStateEdit.registration_end_date = record.registration_end_date
    ? dayjs(record.registration_end_date).format("YYYY-MM-DD")
    : "";
  formStateEdit.start_date = record.start_date
    ? dayjs(record.start_date).format("YYYY-MM-DD")
    : "";
  formStateEdit.end_date = record.end_date
    ? dayjs(record.end_date).format("YYYY-MM-DD")
    : "";
  formStateEdit.description = record.description;

  console.log("Open Edit Modal with record:", formStateEdit);

  isOpenModalEdit.value = true;
};

const onHandleEditSubmit = async () => {
    try {
        await updateCourse(formStateEdit);
        isOpenModalEdit.value = false;
        await fetchAll();
    } catch (error) {
        console.error('Error updating course:', error);
    }
};

</script>

<template>
  <div>
    <div class="title">
      <p>ລາຍການ Course</p>
      <p>
        <a-button type="primary" @click="openModalAdd">ເພີ່ມຂໍ້ມູນ</a-button>
      </p>
    </div>
    <a-table :data-source="data.courses" :columns="columns">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a-switch
              :checked="record.status === 'open'"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
              checked-children="ເປີດ"
              un-checked-children="ປິດ"
            />
            <a-divider type="vertical" />
            <a @click="openEditModal(record)">Edit</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="data.courses.length"
              title="ທ່ານແນ່ໃຈທີ່ຈະລຶບ ຫຼື ບໍ່?"
              ok-text="ຕົກລົງ"
              cancel-text="ຍົກເລີກ"
              @confirm="onDelete(record.id)"
              ><a style="color: red">Delete</a></a-popconfirm
            >
          </span>
        </template>
      </template>
    </a-table>
  </div>
  
<!-- Modal Edit -->
  <a-modal v-model:open="isOpenModalEdit" title="ເເກ້ໄຂ Course" @ok="onHandleEditSubmit">
         <!-- Teachers -->
        <div class="select-container">
            <label for="teacher-select">ອາຈານ</label>
            <a-select
                id="teacher-select"
                v-model:value="formStateEdit.teacher_id"
                show-search
                placeholder="Select a teacher"
                style="width: 100%"
                :options="data.teachers"
            ></a-select>
        </div>

        <!-- Categories -->
        <div class="select-container">
            <label for="category-select">ໝວດໝູ່</label>
            <a-select
                id="category-select"
                v-model:value="formStateEdit.category_id"
                show-search
                placeholder="Select a category"
                style="width: 100%"
                :options="data.categories"
            ></a-select>
        </div>

        <!-- Title -->
        <div class="select-container">
            <label for="title-input">ຫົວຂໍ້</label>
            <a-input
                v-model:value="formStateEdit.title"
                placeholder="ຫົວຂໍ້..."
            ></a-input>
        </div>

        <!-- Max Students -->
        <div class="select-container">
            <label for="max-students-input">ຈຳນວນນັກສຶກສາ</label>
            <a-input
                type="number"
                v-model:value="formStateEdit.max_students"
                placeholder="ຈຳນວນນັກສຶກສາ..."
            ></a-input>
        </div>

        <!-- Max Duration -->
        <div class="select-container">
            <label for="max-duration-input">ຈຳນວນຊົ່ວໂມງ</label>
            <a-input
                type="number"
                v-model:value="formStateEdit.duration_hours"
                placeholder="ຈຳນວນຊົ່ວໂມງ..."
            ></a-input>
        </div>

        <!-- Price -->
        <div class="select-container">
            <label for="max-price-input">ລາຄາ</label>
            <a-input
                type="number"
                v-model:value="formStateEdit.price"
                placeholder="ລາຄາ..."
            ></a-input>
        </div>

        <!-- Registration Start Date -->
        <div class="select-container">
            <label for="registration-start-date-input">ວັນທີ່ເປີດສະໝັກ</label>
            <a-date-picker
                :value-format="'YYYY-MM-DD'"
                v-model:value="formStateEdit.registration_start_date"
                placeholder="ວັນທີ່ເປີດສະໝັກ"
                style="width: 100%"
            ></a-date-picker>
        </div>

        <!-- Registration End Date -->
        <div class="select-container">
            <label for="registration-end-date-input">ວັນທີ່ປິດສະໝັກ</label>
            <a-date-picker
                :value-format="'YYYY-MM-DD'"
                v-model:value="formStateEdit.registration_end_date"
                placeholder="ວັນທີ່ປິດສະໝັກ"
                style="width: 100%"
            ></a-date-picker>
        </div>

        <!-- Start Date -->
        <div class="select-container">
            <label for="start-date-input">ວັນທີ່ເປີດສອນ</label>
            <a-date-picker
                :value-format="'YYYY-MM-DD'"
                v-model:value="formStateEdit.start_date"
                placeholder="ວັນທີ່ເປີດສອນ"
                style="width: 100%"
            ></a-date-picker>
        </div>

        <!-- End Date -->
        <div class="select-container">
            <label for="end-date-input">ວັນທີ່ປິດສອນ</label>
            <a-date-picker
                :value-format="'YYYY-MM-DD'"
                v-model:value="formStateEdit.end_date"
                placeholder="ວັນທີ່ປິດສອນ"
                style="width: 100%"
            ></a-date-picker>
        </div>

         <!-- Description -->
        <div class="select-container">
            <label for="description-input">ລາຍລະອຽດ</label>
            <a-textarea
                v-model:value="formStateEdit.description"
                placeholder="ລາຍລະອຽດ..."
                rows="4"
            ></a-textarea>
        </div>
    </a-modal>

  <!-- Modal Add -->
  <a-modal v-model:open="isOpenModalAdd" title="ສ້າງ Course" @ok="handleSubmit">
    <!-- Teachers -->
    <div class="select-container">
      <label for="teacher-select">ອາຈານ</label>
      <a-select
        id="teacher-select"
        v-model:value="formState.teacher_id"
        show-search
        placeholder="Select a teacher"
        style="width: 100%"
        :options="data.teachers"
      ></a-select>
    </div>

    <!-- Categories -->
    <div class="select-container">
      <label for="category-select">ໝວດໝູ່</label>
      <a-select
        id="category-select"
        v-model:value="formState.category_id"
        show-search
        placeholder="Select a category"
        style="width: 100%"
        :options="data.categories"
      ></a-select>
    </div>

    <!-- Title -->
    <div class="select-container">
      <label for="title-input">ຫົວຂໍ້</label>
      <a-input
        v-model:value="formState.title"
        placeholder="ຫົວຂໍ້..."
      ></a-input>
    </div>

    <!-- Max Students -->
    <div class="select-container">
      <label for="max-students-input">ຈຳນວນນັກສຶກສາ</label>
      <a-input
        type="number"
        v-model:value="formState.max_students"
        placeholder="ຈຳນວນນັກສຶກສາ..."
      ></a-input>
    </div>

    <!-- Max Duration -->
    <div class="select-container">
      <label for="max-duration-input">ຈຳນວນຊົ່ວໂມງ</label>
      <a-input
        type="number"
        v-model:value="formState.duration_hours"
        placeholder="ຈຳນວນຊົ່ວໂມງ..."
      ></a-input>
    </div>

    <!-- Price -->
    <div class="select-container">
      <label for="max-price-input">ລາຄາ</label>
      <a-input
        type="number"
        v-model:value="formState.price"
        placeholder="ລາຄາ..."
      ></a-input>
    </div>

    <!-- Registration Start Date -->
    <div class="select-container">
      <label for="registration-start-date-input">ວັນທີ່ເປີດສະໝັກ</label>
      <a-date-picker
        v-model:value="formState.registration_start_date"
        placeholder="ວັນທີ່ເປີດສະໝັກ"
        style="width: 100%"
      ></a-date-picker>
    </div>

    <!-- Registration End Date -->
    <div class="select-container">
      <label for="registration-end-date-input">ວັນທີ່ປິດສະໝັກ</label>
      <a-date-picker
        v-model:value="formState.registration_end_date"
        placeholder="ວັນທີ່ປິດສະໝັກ"
        style="width: 100%"
      ></a-date-picker>
    </div>

    <!-- Start Date -->
    <div class="select-container">
      <label for="start-date-input">ວັນທີ່ເປີດສອນ</label>
      <a-date-picker
        v-model:value="formState.start_date"
        placeholder="ວັນທີ່ເປີດສອນ"
        style="width: 100%"
      ></a-date-picker>
    </div>

    <!-- End Date -->
    <div class="select-container">
      <label for="end-date-input">ວັນທີ່ປິດສອນ</label>
      <a-date-picker
        v-model:value="formState.end_date"
        placeholder="ວັນທີ່ປິດສອນ"
        style="width: 100%"
      ></a-date-picker>
    </div>

    <!-- Description -->
    <div class="select-container">
      <label for="description-input">ລາຍລະອຽດ</label>
      <a-textarea
        v-model:value="formState.description"
        placeholder="ລາຍລະອຽດ..."
        rows="4"
      ></a-textarea>
    </div>
  </a-modal>

</template>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  p {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
}

.select-container {
  margin-bottom: 10px;
}
</style>
