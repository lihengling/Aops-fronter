<script setup lang="tsx">
import { PropType, ref, nextTick } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag, ElTree } from 'element-plus'
import { getPermissionListApi } from '@/api/permission'

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
      disabled: 'disabled',
      children: keyPermissions[key].map((permission) => ({
        id: permission.id,
        label: `${permission.description} - ${permission.permission_name}`,
        disabled: 'disabled'
      }))
    }
    treeRes.push(keyNode)
  }

  if (treeRes) {
    treeData.value = treeRes
    await nextTick()
  }
}
getPermissionList()

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'role_name',
    label: '角色名称'
  },
  {
    field: 'name',
    label: '角色标识'
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
    label: '是否管理员',
    slots: {
      default: (data: any) => {
        return (
          <ElTag type={!data.is_admin ? 'danger' : 'success'}>{data.is_admin ? '是' : '否'}</ElTag>
        )
      }
    }
  },
  {
    field: 'description',
    label: '备注',
    span: 24
  },
  {
    field: 'permissionList',
    label: '权限分配',
    span: 24,
    slots: {
      default: (data: any) => {
        let checkedData = ref<number[]>([])
        for (const x in data.permissions) {
          checkedData.value.push(data.permissions[x].id)
        }
        return (
          <>
            <div class="flex w-full">
              <div class="flex-1">
                <ElTree
                  node-key="id"
                  props={{ label: 'label', children: 'children' }}
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
