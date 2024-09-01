var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;
/**
 * @params plainPassword: supplied when signup
 */
export function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hash;
    });
}
/**
 * @params options.plainPassword: supplied when login
 * @params options.hashedPassword: looked up from database
 */
export function checkPassword(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatched = yield bcrypt.compare(options.plainPassword, options.hashedPassword);
        return isMatched;
    });
}
