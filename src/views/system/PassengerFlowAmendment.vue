<template>
  <Modal
    v-model:visible="newAmendment.open"
    title="选择要调整的统计组"
    placeholder="请选择"
    @ok="handleNewAmendmentModalConfirm()"
  >
    <ASelect
      v-model:value="newAmendment.gid"
      :options="newAmendment.groupList"
      style="width: 150px"
    />
  </Modal>

  <Modal
    v-model:visible="modalOpen"
    width="1000px"
    class="model-card"
    :title="modalTitle"
  >
    <div class="model-card-content">
      <div style="display: grid;grid-template-columns: 1fr 1fr;grid-gap: 20px;">
        <ACard
          class="operator-card"
          :class="[formData.switch === 0 ? 'pinning': '']"
          :bodyStyle="{position: 'relative', cursor: 'pointer'}"
          title="实时客流"
          @click="formData.switch = 0"
        >
          <PushpinOutlined
            v-show="formData.switch === 0"
            style="position: absolute;right: 10px;top: -45px;font-size: 28px;font-weight: bold;color: #1890ff"
          />
          <div
            flex="dir:left box:mean"
            style="height: 65px;"
          >
            <div flex="dir:top main:justify">
              <div flex="dir:left cross:center">
                <LoginOutlined style="font-size: 26px;color:rgba(0,0,0,.3);margin-right: 5px;" />
                <span>入园：</span><span class="num-text">{{ formData.outNum }}</span><span>人</span>
              </div>
              <div flex="dir:left cross:center">
                <LogoutOutlined style="font-size: 26px;color:rgba(0,0,0,.3);margin-right: 5px;" />
                <span>出园：</span><span class="num-text">{{ formData.inNum }}</span><span>人</span>
              </div>
            </div>
            <div flex="dir:top cross:center">
              <TeamOutlined style="font-size: 36px;color:rgba(0,0,0,.5);" />
              <div flex="dir:left cross:baseline">
                <span>在园：</span>
                <span class="num-text">{{ formData.liveNum }}</span>
                <span>人</span>
              </div>
            </div>
          </div>
        </ACard>
        <ACard
          class="operator-card"
          :class="[formData.switch === 1 ? 'pinning': '']"
          :bodyStyle="{position: 'relative', cursor: 'pointer'}"
          @click="formData.switch = 1"
        >
          <PushpinOutlined
            v-show="formData.switch === 1"
            style="position: absolute;right: 10px;top: -45px;font-size: 28px;font-weight: bold;color: #1890ff"
          />
          <template #title>
            <h5>优化客流 <span style="color:#ccc;">仅当日生效，次日0时自动恢复为实时客流</span></h5>
          </template>
          <div flex="dir:left box:mean">
            <div
              flex="dir:top box:mean"
              style="height: 65px;"
            >
              <div flex="dir:top main:justify">
                <div flex="dir:left cross:center">
                  <LoginOutlined style="font-size: 26px;color:rgba(0,0,0,.3);margin-right: 5px;" />
                  <span>入园：</span><span class="num-text">{{ inPlusResult }}</span><span>人</span>
                </div>
                <div flex="dir:left cross:center">
                  <LogoutOutlined style="font-size: 26px;color:rgba(0,0,0,.3);margin-right: 5px;" />
                  <span>出园：</span><span class="num-text">{{ outPlusResult }}</span><span>人</span>
                </div>
              </div>
            </div>
            <div flex="dir:top cross:center">
              <TeamOutlined style="font-size: 36px;color:rgba(0,0,0,.5);" />
              <div flex="dir:left cross:baseline">
                <span>在园：</span>
                <span class="num-text">{{ liveResult }}</span>
                <span>人</span>
              </div>
            </div>
          </div>
        </ACard>
      </div>
      <div
        class="operator-form"
        :class="{'disble-form': formData.switch === 0}"
        flex="dir:left box:first"
      >
        <Card class="form-column">
          <ATabs
            v-model:activeKey="formData.operateType"
            type="card"
            tabPosition="left"
          >
            <ATabPane
              key="quick"
              tab="快速调整"
            >
              <div
                class="quick-form"
                style="height: 210px;"
                flex="dir:top cross:center main:center"
              >
                <div flex="dir:left cross:baseline">
                  <h3 style="font-weight: bold;font-size: 16px;">
                    出园人数增加
                  </h3>
                  <span style="color:rgba(0,0,0,0.4);margin-left: 4px;">此功能仅限出园人数的增加，如需要减少等操作，请使用公式调整</span>
                </div>
                <div style="margin-top: 10px">
                  <AInput
                    v-model:value.number="formData.outPlusNum"
                    style="width: 150px;margin-right: 8px;"
                  /><span>人</span>
                </div>
              </div>
            </ATabPane>

            <ATabPane
              key="formula"
              tab="公式调整"
            >
              <table style="width: 100%;height: 210px;">
                <thead>
                  <tr>
                    <th style="width: 80px;" />
                    <th style="min-width: 40px;text-align: center;">
                      在园人数
                    </th>
                    <th style="min-width: 40px;text-align: center;">
                      =
                    </th>
                    <th style="width: 140px;text-align: center;">
                      入园人数
                    </th>
                    <th style="min-width: 40px;text-align: center;">
                      -
                    </th>
                    <th style="width: 140px;text-align: center;">
                      出园人数
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>当前</td>
                    <td />
                    <td />
                    <td>
                      <div
                        flex="dir:left cross:center main:justify"
                        class="operator-cell"
                      >
                        <ASelect
                          v-model:value="formData.inPlusType"
                          :options="plusTypeOptions"
                        />
                        <AInput
                          v-model:value.number="formData.inPlusNum"
                          style="width: 80px"
                        />
                      </div>
                    </td>
                    <td />
                    <td>
                      <div
                        flex="dir:left cross:center main:justify"
                        class="operator-cell"
                      >
                        <ASelect
                          v-model:value="formData.outPlusType"
                          :options="plusTypeOptions"
                        />
                        <AInput
                          v-model:value.number="formData.outPlusNum"
                          style="width: 80px"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>调整后</td>
                    <td style="text-align: center;">
                      {{ liveResult }}
                    </td>
                    <td />
                    <td style="text-align: center;">
                      {{ inPlusResult }}
                    </td>
                    <td />
                    <td style="text-align: center;">
                      {{ outPlusResult }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="6"
                      style="text-align: center;"
                    >
                      <span style="color: rgba(0,0,0,.5)">注：当只有出园人数增加时，保存后将自动转换为“快速调整”模式</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </ATabPane>
          </ATabs>
        </Card>
      </div>
    </div>
    <template #footer>
      <AButton
        key="back"
        @click="modalOpen = false"
      >
        取消
      </AButton>
      <AButton
        key="submit"
        type="primary"
        :loading="formData.submitLoading"
        @click="handleModelConfirm"
      >
        确定
      </AButton>
    </template>
  </Modal>

  <div class="page-container">
    <template
      v-if="amendmentDataList.length > 0"
    >
      <ACard
        v-for="data in amendmentDataList"
        :key="data.id"
        class="config-item"
        :title="data.name"
      >
        <template #extra>
          <AButton
            type="dashed"
            size="small"
            :loading="data.queryLoading"
            @click="handleEditBtn(data)"
          >
            编辑
          </AButton>
        </template>
        <p>
          <span style="color:#ccc;">当前方式：</span>
          <span style="font-weight: bold;">{{ data.switch === 1 ? '优化客流' : '实时客流' }}</span>
        </p>
        <template v-if="data.switch === 1">
          <div>
            <span>入园：</span>
            <span>{{ data.inPlus > 0 ? `+${data.inPlus}`: data.inPlus }}</span>
          </div>
          <div>
            <span>出园：</span>
            <span>{{ data.outPlus > 0 ? `+${data.outPlus}`: data.outPlus }}</span>
          </div>
        </template>
      </ACard>
    </template>
    <ACard
      class="config-item add"
      @click="newAmendment.open = true"
    >
      <PlusOutlined
        class="icon"
        style="width: 60px;height: 60px;border-radius: 50%;display:flex;justify-content: center;align-items: center;"
      />
    </ACard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watchEffect } from 'vue'
import { PlusOutlined, PushpinOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { getAmendmentList, getAmendmentGroup, getAmendmentInout, updAmendment } from '../../api/passengerFlowAmendment'
import { Modal, message } from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue'

defineOptions({ name: 'PassengerFlowAmendment' })

interface AmendmentConfigItem {
  id: number
  gid: number
  kanban: number
  switch: number
  type: number
  inPlus: number
  outPlus: number
  createdAt: string
  updatedAt: string
}

type AmendmentDataItem = AmendmentConfigItem & {
  name: string;
  queryLoading: boolean;
}

interface AmendmentGroupItem {
   id: number;
  sid:number;
  serialNo: string;
  name: string;
  gates?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface GroupAmendmentMap {
  [key: string]: string
}

interface AmendmentForm {
  id: number | null;
  inNum: number;
  outNum: number;
  liveNum: number;
  switch: number;
  operateType: 'quick' | 'formula';
  inPlusType: 'invariant' | 'increase' | 'decrease';
  outPlusType: 'invariant' | 'increase' | 'decrease';
  inPlusNum: number;
  outPlusNum: number;
  submitLoading: boolean;
}

interface NewAmendmentConfig {
  groupList: SelectProps['options'],
  open: boolean;
  gid: any;
}

const amendmentConfigList = ref<AmendmentConfigItem[]>([])
const groupNameMap = reactive<GroupAmendmentMap>({})
const amendmentDataList = ref<AmendmentDataItem[]>([])
const modalOpen = ref<boolean>(false)
const modalTitle = ref<string>('新增客流优化配置')
const plusTypeOptions = [
  {
    label: '不变',
    value: 'invariant'
  },
  {
    label: '增加',
    value: 'increase'
  },
  {
    label: '减少',
    value: 'decrease'
  }
]
const newAmendment = reactive<NewAmendmentConfig>({
  groupList: [],
  open: false,
  gid: null
})

async function handleNewAmendmentModalConfirm() {
  newAmendment.open = false
  try {
    const { total } = await getAmendmentInout(newAmendment.gid + '')
    formData.id = newAmendment.gid
    formData.inNum = total.in
    formData.outNum = total.out
    formData.liveNum = total.in - total.out
    formData.switch = 0
    formData.inPlusNum = 0
    formData.outPlusNum = 0
    formData.inPlusType = 'invariant'
    formData.outPlusType = 'invariant'
    formData.operateType = 'quick'
    modalTitle.value = `新增【${groupNameMap[`id-${newAmendment.gid}`]}】客流优化`

    modalOpen.value = true
  } catch (error) {
    message.error('获取出入园数据出错！')
  }
}

const formData = reactive<AmendmentForm>({
  id: null,
  inNum: 0,
  outNum: 0,
  liveNum: 0,
  switch: 0,
  operateType: 'quick',
  inPlusType: 'invariant',
  outPlusType: 'invariant',
  inPlusNum: 0,
  outPlusNum: 0,
  submitLoading: false
})

const outPlusResult = computed((): number => {
  let result = 0
  if (formData.operateType === 'quick') {
    result = formData.outNum + formData.outPlusNum
  } else {
    switch (formData.outPlusType) {
      case 'increase':
        result = formData.outNum + (formData.outPlusNum ? formData.outPlusNum : 0)
        break
      case 'decrease':
        result = formData.outNum - (formData.outPlusNum ? formData.outPlusNum : 0)
        break
      default:
        result = formData.outNum
        break
    }
  }
  return typeof result === 'number' && result >= 0 ? result : 0
})

const inPlusResult = computed((): number => {
  let result = 0
  switch (formData.inPlusType) {
    case 'increase':
      result = formData.inNum + (formData.inPlusNum ? formData.inPlusNum : 0)
      break
    case 'decrease':
      result = formData.inNum - (formData.inPlusNum ? formData.inPlusNum : 0)
      break
    default:
      result = formData.inNum
      break
  }
  return typeof result === 'number' && result >= 0 ? result : 0
})

const liveResult = computed((): number => {
  const result = inPlusResult.value - outPlusResult.value
  return typeof result === 'number' && result >= 0 ? result : 0
})

function calcPlusNum(type: 'invariant' | 'increase' | 'decrease', num: number): number {
  let result = 0
  switch (type) {
    case 'increase':
      result = num
      break
    case 'decrease':
      result = Number(`-${num}`)
      break
    default:
      break
  }
  return result
}

async function handleModelConfirm() {
  try {
    formData.submitLoading = true
    const data = {
      gid: formData.id,
      switch: formData.switch,
      type: 0,
      inPlus: calcPlusNum(formData.inPlusType, formData.inPlusNum),
      outPlus: calcPlusNum(formData.outPlusType, formData.outPlusNum)
    }
    await updAmendment(data)
    message.success('修改配置成功！')
    await pageLoad()
    modalOpen.value = false
    formData.submitLoading = false
  } catch (error) {
    formData.submitLoading = false
    message.error('修改配置失败！')
  }
}

const listParams = {
  page: 1,
  pageSize: 100
}

function numTransformType(num: number): 'invariant' | 'increase' | 'decrease' {
  if (num === 0) {
    return 'invariant'
  } else if (num < 0) {
    return 'decrease'
  }
  return 'increase'
}

async function handleEditBtn(data: AmendmentDataItem) {
  data.queryLoading = true
  try {
    const { total } = await getAmendmentInout(data.gid + '')
    formData.id = data.gid
    formData.inNum = total.in
    formData.outNum = total.out
    formData.liveNum = total.in - total.out
    formData.switch = data.switch
    formData.inPlusNum = Math.abs(data.inPlus) || 0
    formData.outPlusNum = Math.abs(data.outPlus) || 0
    formData.inPlusType = numTransformType(data.inPlus)
    formData.outPlusType = numTransformType(data.outPlus)
    formData.operateType = data.inPlus === 0 && data.outPlus > 0 ? 'quick' : 'formula'
    modalTitle.value = `编辑【${data.name}】客流优化`

    modalOpen.value = true
    data.queryLoading = false
  } catch (error) {
    message.error('获取出入园数据出错！')
  }
}

async function pageLoad() {
  try {
    const { list } = await getAmendmentList(listParams)
    amendmentConfigList.value = list
    console.log('amendmentConfigList.value', amendmentConfigList.value)
  } catch (error) {
    console.error(error)
    return Promise.reject()
  }

  try {
    const groupList: AmendmentGroupItem[] = await getAmendmentGroup()
    newAmendment.groupList = groupList.map(({ id, name }) => ({
      label: name,
      value: id
    }))
    groupList.map(item => {
      groupNameMap[`id-${item.id}`] = item.name
    })
    console.log('groupNameMap', groupNameMap)
  } catch (error) {
    console.error(error)
    return Promise.reject()
  }

  return Promise.resolve()
}

watchEffect(() => {
  if (amendmentConfigList.value.length > 0 && groupNameMap) {
    amendmentDataList.value = amendmentConfigList.value.map(item => {
      const { gid } = item
      const name = groupNameMap[`id-${gid}`] || ''
      return {
        ...item,
        name,
        queryLoading: false
      }
    })
  }
})

onMounted(async() => {
  await pageLoad()
})
</script>

<style lang="less" scoped>
.page-container {
  padding: 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  grid-gap: 20px;

  .model-card {
    // height: 60%;
  }

  .config-item {
    height: 250px;
    font-size: 16px;
  }

  .config-item.add {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .config-item.add:hover {
    cursor: pointer;
    border: 1px dashed rgba(0, 0, 0, .8);

    .icon {
      border: 1px dashed rgba(0, 0, 0, .8);
    }
  }

}
.operator-form{
  margin-top: 10px;
  position: relative;
}

.operator-form.disble-form::before{
  content: '';
  width: 100%;
  height: 100%;
  background: rgba(0,0,0);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999;
  cursor:not-allowed;
  opacity: .4;
  border-radius: 10px;
}

.formula-form{
  display: grid;
  grid-template-columns: 40px 80px 10px 1fr 10px 1fr;
  grid-template-rows: repeat(4, 1fr);

  .cell-item{
    text-align: center;
  }
}

.num-text{
  font-size: 18px;
  font-weight: bold;
  margin: 0 4px;
}

.operator-cell{
  width: 160px;
}

.form-column{
  width: 100%;
}

.operator-card.pinning {
  border: 1px dashed rgba(0, 0, 0, .8) !important;
}
</style>
