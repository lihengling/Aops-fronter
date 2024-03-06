<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree } from 'element-plus'
import { getPermissionListApi } from '@/api/permission'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'role_name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'name',
    label: '角色标识',
    component: 'Input'
  },
  {
    field: 'is_active',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: false
        },
        {
          label: t('userDemo.enable'),
          value: true
        }
      ]
    }
  },
  {
    field: 'is_admin',
    label: '是否管理员',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '否',
          value: false
        },
        {
          label: '是',
          value: true
        }
      ]
    }
  },
  {
    field: 'description',
    label: '备注',
    component: 'Input'
  },
  {
    field: '',
    label: '权限分配',
    component: 'Divider'
  }
])

const rules = reactive({
  role_name: [required()],
  name: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref([])
const defaultCheckedData = ref<number[]>([])

const getPermissionList = async () => {
  const res = await getPermissionListApi()
  const keyPermissions = {}

  for (const index in res.data) {
    const key = res.data[index].permission_name.split('_')[0]
    if (!keyPermissions[key]) {
      keyPermissions[key] = []
    }
    keyPermissions[key].push(res.data[index])
  }

  // 构建树型数据
  const treeRes: any = []
  for (const key in keyPermissions) {
    const keyNode = {
      id: key,
      label: key,
      children: keyPermissions[key].map((permission) => ({
        id: permission.id,
        label: `${permission.description} - ${permission.permission_name}`
      }))
    }
    treeRes.push(keyNode)
  }

  // 默认勾选
  let formData = await getFormData()
  for (const x in formData.permissions) {
    defaultCheckedData.value.push(formData.permissions[x].id)
  }

  if (treeRes) {
    treeData.value = treeRes
    await nextTick()
  }
}
getPermissionList()

let treeRef = ref()
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    delete formData['permissions']
    let permissionId: Array<number> = []
    let checkedId = treeRef.value.getCheckedNodes()

    for (const x in checkedId) {
      if (typeof checkedId[x].id === 'number') {
        permissionId.push(checkedId[x].id)
      }
    }

    // 这里应该把表单返回出去到 save 方法提交
    formData['permission_id'] = permissionId
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <ElTree
    ref="treeRef"
    node-key="id"
    :data="treeData"
    :default-checked-keys="defaultCheckedData"
    :props="{ label: 'label', children: 'children' }"
    show-checkbox
  />
</template>
