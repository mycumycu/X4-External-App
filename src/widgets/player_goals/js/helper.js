export default class Helper {
    static getGoalIndex(list, id) {
        let response = false;
        Object.values(list).forEach((element, index) => {
            if (element.id === id) {
                response = index;
            }
        })
        return response;
    }
}