import { SyGrup } from "../master/sy/SyGrup"
import { SyUser } from "../master/sy/SyUser"
import { SyParm } from "../master/sy/SyParm"

import { NavHome } from "../pages/NavHome"
import { NavProduct } from "../pages/NavProduct"

const Components = {
    'sygrup': SyGrup, 'syparm': SyParm, 'syuser': SyUser,
    'NavHome' : NavHome, 'NavProduct' : NavProduct
}

import { GModal } from "./GModal"
import { GListEdit } from "./GListEdit"
import { GModalList } from './GModalList'
import { GInputNumber } from "./GInputNumber"
import { GInputDate } from "./GInputDate"
import { GInputSkuV1 } from "./GInputSkuV1"
import { GReportV1 } from "./GReportV1"
import { GFormEdit } from "./GFormEdit"
import { GList } from "./GList"

// const URL_API = 'http://192.168.8.19:84/api/'
const URL_API = 'http://192.168.8.24/api/'

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});


export {GFormEdit, GList, GInputNumber, GModal, GModalList, GListEdit, GInputDate, GInputSkuV1, GReportV1, URL_API, Components, numberFormat}