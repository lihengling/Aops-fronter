<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag, ElTree } from 'element-plus'
import { getMenuListApi } from '@/api/menu'

const treeData = ref<any[]>([])

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

const getMenuList = async () => {
  const res = await getMenuListApi()
  treeData.value = res.data
}
getMenuList()

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'username',
    label: '用户名'
  },
  {
    field: 'is_active',
    label: '状态',
    slots: {
      default: (data: any) => {
        return renderTag(data.is_active)
      }
    }
  },
  {
    field: 'is_admin',
    label: '是否启用管理员',
    slots: {
      default: (data: any) => {
        return renderTag(data.is_admin)
      }
    }
  },
  {
    field: 'department',
    label: '部门名称',
    slots: {
      default: (data: any) => {
        return data.department.department_name
      }
    }
  },
  {
    field: 'created_at',
    label: '创建时间',
    span: 88
  },
  {
    field: 'roleList',
    label: '角色分配',
    span: 24,
    slots: {
      default: (data: any) => {
        let checkedData = ref<object[]>([])
        let defaultCheckedData = ref<string[]>([])

        for (const key in data.role) {
          const keyNode = {
            id: key,
            label: `${data.role[key].name} - ${data.role[key].role_name} - ${data.role[key].description} `,
            disabled: 'disabled'
          }
          checkedData.value.push(keyNode)
          defaultCheckedData.value.push(key)
        }
        return (
          <>
            <div class="flex w-full">
              <div class="flex-1">
                <ElTree
                  node-key="id"
                  props={{ label: 'label' }}
                  data={checkedData.value}
                  default-checked-keys={defaultCheckedData.value}
                  show-checkbox
                ></ElTree>
              </div>
            </div>
          </>
        )
      }
    }
  },
  {
    field: 'menuList',
    label: '菜单分配',
    span: 24,
    slots: {
      default: (data: any) => {
        console.log(data)
        let checkedData = ref<number[]>([])
        // 这里要类似路由那样去除 children 的id 勾选，不能够存在 # 的菜单
        // for (const x in data.menu) {
        //   if (!data.menu[x].component.includes('#')) {
        //     checkedData.value.push(data.menu[x].id)
        //   }
        //   console.log(data.menu[x].component)
        // }
        return (
          <>
            <div class="flex w-full">
              <div class="flex-1">
                <ElTree
                  node-key="id"
                  props={{ label: 'menu_title', children: 'children' }}
                  data={treeData.value}
                  default-checked-keys={checkedData.value}
                  show-checkbox
                ></ElTree>
              </div>
            </div>
          </>
        )
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
