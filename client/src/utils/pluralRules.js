export const pluralRules = (views) => {
    const options = {
        one: "просмотр",
        few: "просмотра",
        many: "просмотров",
    }
    return `${views} ${russianPluralRules(views, options)}`
}

export const pluralSubs = (subs) => {
    const options = {
        one: "подписчик",
        few: "подписчика",
        many: "подписчиков",
    }
    return `${subs} ${russianPluralRules(subs, options)}`
}

export const pluralComments = (comments) => {
    const options = {
        one: "комментарий",
        few: "комментария",
        many: "комментариев",
    }
    return `${comments} ${russianPluralRules(comments, options)}`
}

const russianPluralRules = (number, options) => options[new Intl.PluralRules("ru-RU").select(number)]