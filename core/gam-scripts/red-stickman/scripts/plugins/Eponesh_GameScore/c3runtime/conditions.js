function each(e, r, t) {
  const s = e.sdk.createLoopingConditionContext();
  for (let e = 0; e < r.length && (t(r[e], e), s.retrigger(), !s.isStopped); ++e);
  s.release()
}

function isExists(e) {
  return e && !!e.id
}
globalThis.C3.Plugins.Eponesh_GameScore.Cnds = {
  OnPlayerChange() {
    return !0
  },
  OnPlayerFieldIncrement(e) {
    return this.currentPlayerFieldKey === e
  },
  OnPlayerFieldMaximum(e) {
    return this.currentPlayerFieldKey === e
  },
  OnPlayerFieldMinimum(e) {
    return this.currentPlayerFieldKey === e
  },
  OnPlayerSyncComplete() {
    return !0
  },
  OnPlayerSyncError() {
    return !0
  },
  OnPlayerLoadComplete() {
    return !0
  },
  OnPlayerLoadError() {
    return !0
  },
  OnPlayerLoginComplete() {
    return !0
  },
  OnPlayerLoginError() {
    return !0
  },
  OnPlayerLogoutComplete() {
    return !0
  },
  OnPlayerLogoutError() {
    return !0
  },
  OnPlayerFetchFieldsComplete() {
    return !0
  },
  OnPlayerFetchFieldsError() {
    return !0
  },
  OnPlayerReady() {
    return !0
  },
  IsPlayerReady() {
    return this.isPlayerReady
  },
  IsPlayerStub() {
    return this.gp.player.isStub
  },
  IsPlayerLoggedIn() {
    return this.gp.player.isLoggedIn
  },
  PlayerHasKey(e) {
    return this.gp.player.has(e)
  },
  PlayerFieldIsEnum(e) {
    return this.gp.player.getField(e).variants.length
  },
  PlayerCompareScore(e, r) {
    return this.mappers.compare[e](this.gp.player.score, r)
  },
  PlayerCompare(e, r, t) {
    return this.mappers.compare[r](this.gp.player.get(e), t)
  },
  PlayerEachField() {
    return each(this.runtime, this.gp.player.fields, e => {
      this.currentPlayerFieldKey = e.key, this.currentPlayerFieldType = e.type, this.currentPlayerFieldName = e.name, this.currentPlayerFieldValue = this.gp.player.get(e.key)
    }), !1
  },
  PlayerEachFieldVariant(e) {
    return each(this.runtime, this.gp.player.getField(e).variants, (e, r) => {
      this.currentPlayerFieldVariantValue = e.value, this.currentPlayerFieldVariantName = e.name, this.currentPlayerFieldVariantIndex = r
    }), !1
  },
  OnLeaderboardOpen() {
    return !0
  },
  OnLeaderboardClose() {
    return !0
  },
  OnLeaderboardFetch(e) {
    return this.lastLeaderboardTag === e
  },
  OnLeaderboardAnyFetch() {
    return !0
  },
  OnLeaderboardFetchError(e) {
    return this.lastLeaderboardTag === e
  },
  OnLeaderboardAnyFetchError() {
    return !0
  },
  OnLeaderboardFetchPlayer(e) {
    return this.lastLeaderboardPlayerRatingTag === e
  },
  OnLeaderboardAnyFetchPlayer() {
    return !0
  },
  OnLeaderboardFetchPlayerError(e) {
    return this.lastLeaderboardPlayerRatingTag === e
  },
  OnLeaderboardAnyFetchPlayerError() {
    return !0
  },
  OnLeaderboardPublishRecord() {
    return !0
  },
  OnLeaderboardPublishRecordError() {
    return !0
  },
  LeaderboardEachPlayer() {
    return each(this.runtime, this.leaderboard, (e, r) => {
      this.currentLeaderboardIndex = r, this.currentLeaderboardPlayer = e
    }), !1
  },
  LeaderboardEachTopPlayer() {
    return each(this.runtime, this.leaderboardResult.topPlayers, (e, r) => {
      this.currentLeaderboardIndex = r, this.currentLeaderboardPlayer = e
    }), !1
  },
  LeaderboardEachAbovePlayer() {
    return each(this.runtime, this.leaderboardResult.abovePlayers, (e, r) => {
      this.currentLeaderboardIndex = r, this.currentLeaderboardPlayer = e
    }), !1
  },
  LeaderboardEachBelowPlayer() {
    return each(this.runtime, this.leaderboardResult.belowPlayers, (e, r) => {
      this.currentLeaderboardIndex = r, this.currentLeaderboardPlayer = e
    }), !1
  },
  OnAchievementsOpen() {
    return !0
  },
  OnAchievementsClose() {
    return !0
  },
  OnAchievementsFetch() {
    return !0
  },
  OnAchievementsFetchError() {
    return !0
  },
  OnAchievementsUnlock(e) {
    var r = parseInt(e, 10) || 0;
    return this.currentAchievement.tag === e || this.currentAchievement.id === r
  },
  OnAchievementsAnyUnlock() {
    return !0
  },
  OnAchievementsAnyUnlockError() {
    return !0
  },
  OnAchievementsSetProgress(e) {
    var r = parseInt(e, 10) || 0;
    return this.currentAchievement.tag === e || this.currentAchievement.id === r
  },
  OnAchievementsAnySetProgress() {
    return !0
  },
  OnAchievementsAnySetProgressError() {
    return !0
  },
  AchievementsPickAchievement(e) {
    var {
      achievement: e,
      playerAchievement: r,
      achievementGroup: t
    } = this.gp.achievements.getAchievement(e);
    return !!e && (this.currentAchievementIndex = 0, this.currentAchievement = e, r && (this.currentAchievement.unlocked = r.unlocked, this.currentAchievement.progress = r.progress), t && (this.currentAchievementsGroupIndex = 0, this.currentAchievementsGroupId = t.id, this.currentAchievementsGroupTag = t.tag, this.currentAchievementsGroupName = t.name, this.currentAchievementsGroupDescription = t.description), !0)
  },
  AchievementsEachAchievement() {
    return each(this.runtime, this.gp.achievements.list, (e, r) => {
      var t = this.gp.achievements.getAchievement(e.id)["playerAchievement"];
      this.currentAchievementIndex = r, this.currentAchievement = e, t && (this.currentAchievement.unlocked = t.unlocked, this.currentAchievement.progress = t.progress)
    }), !1
  },
  AchievementsEachAchievementInGroup(r) {
    const t = parseInt(r, 10) || 0,
      e = this.gp.achievements.groupsList.find(e => e.tag === r || e.id === t);
    var s = e ? e.achievements.reduce((e, r) => {
      var {
        achievement: r,
        playerAchievement: t
      } = this.gp.achievements.getAchievement(r);
      return r && e.push({
        achievement: r,
        playerAchievement: t
      }), e
    }, []) : [];
    return each(this.runtime, s, ({
      achievement: e,
      playerAchievement: r
    }, t) => {
      this.currentAchievementIndex = t, this.currentAchievement = e, r && (this.currentAchievement.unlocked = r.unlocked, this.currentAchievement.progress = r.progress)
    }), !1
  },
  AchievementsEachAchievementsGroup() {
    return each(this.runtime, this.gp.achievements.groupsList, (e, r) => {
      this.currentAchievementsGroupIndex = r, this.currentAchievementsGroupId = e.id, this.currentAchievementsGroupTag = e.tag, this.currentAchievementsGroupName = e.name, this.currentAchievementsGroupDescription = e.description
    }), !1
  },
  AchievementsEachPlayerAchievements() {
    return each(this.runtime, this.gp.achievements.unlockedList, (e, r) => {
      this.currentPlayerAchievementIndex = r, this.currentPlayerAchievementId = e.id, this.currentPlayerAchievementUnlockDate = e.createdAt
    }), !1
  },
  IsAchievementsCurAchievementUnlocked() {
    return this.currentAchievement.unlocked
  },
  IsAchievementsCurAchievementLockedVisible() {
    return !!this.currentAchievement.isLockedVisible
  },
  IsAchievementsCurAchievementLockedDescriptionVisible() {
    return !!this.currentAchievement.isLockedDescriptionVisible
  },
  IsAchievementsUnlockSuccessful() {
    return this.isUnlockAchievementSuccess
  },
  AchievementsIsUnlocked(e) {
    return this.gp.achievements.has(e)
  },
  OnPaymentsFetchProducts() {
    return !0
  },
  OnPaymentsFetchProductsError() {
    return !0
  },
  OnEventConnect() {
    return !0
  },
  OnPaymentsPurchase(e) {
    var r = parseInt(e, 10) || 0;
    return this.purchasedProductTag === e || this.purchasedProductId === r
  },
  OnPaymentsPurchaseError(e) {
    var r = parseInt(e, 10) || 0;
    return this.purchasedProductTag === e || this.purchasedProductId === r
  },
  OnPaymentsAnyPurchase() {
    return !0
  },
  OnPaymentsAnyPurchaseError() {
    return !0
  },
  OnPaymentsConsume(e) {
    var r = parseInt(e, 10) || 0;
    return this.consumedProductTag === e || this.consumedProductId === r
  },
  OnPaymentsConsumeError(e) {
    var r = parseInt(e, 10) || 0;
    return this.consumedProductTag === e || this.consumedProductId === r
  },
  OnPaymentsAnyConsume() {
    return !0
  },
  OnPaymentsAnyConsumeError() {
    return !0
  },
  OnPaymentsSubscribe(e) {
    var r = parseInt(e, 10) || 0;
    return this.purchasedProductTag === e || this.purchasedProductId === r
  },
  OnPaymentsSubscribeError(e) {
    var r = parseInt(e, 10) || 0;
    return this.purchasedProductTag === e || this.purchasedProductId === r
  },
  OnPaymentsAnySubscribe() {
    return !0
  },
  OnPaymentsAnySubscribeError() {
    return !0
  },
  OnPaymentsUnsubscribe(e) {
    var r = parseInt(e, 10) || 0;
    return this.purchasedProductTag === e || this.purchasedProductId === r
  },
  OnPaymentsUnsubscribeError(e) {
    var r = parseInt(e, 10) || 0;
    return this.purchasedProductTag === e || this.purchasedProductId === r
  },
  OnPaymentsAnyUnsubscribe() {
    return !0
  },
  OnPaymentsAnyUnsubscribeError() {
    return !0
  },
  PaymentsPickProduct(e) {
    const r = this.gp.payments.getProduct(e);
    return !!r && (this.currentProductIndex = 0, this.currentProduct = r, this.currentProductPurchases = this.gp.payments.purchases.filter(e => e.productId === r.id).length, !0)
  },
  PaymentsEachProduct() {
    return each(this.runtime, this.gp.payments.products, (r, e) => {
      this.currentProductIndex = e, this.currentProduct = r, this.currentProductPurchases = this.gp.payments.purchases.filter(e => e.productId === r.id).length
    }), !1
  },
  PaymentsEachPurchase() {
    return each(this.runtime, this.gp.payments.purchases, (e, r) => {
      this.currentPurchaseIndex = r, this.currentPurchase = e
    }), !1
  },
  IsPaymentsCurProductPurchased() {
    return 0 < this.currentProductPurchases
  },
  IsPaymentsPurchaseSuccessful() {
    return this.isPurchaseProductSuccess
  },
  IsPaymentsConsumeSuccessful() {
    return this.isConsumeProductSuccess
  },
  IsPaymentsSubscribeSuccessful() {
    return this.isSubscribeProductSuccess
  },
  IsPaymentsUnsubscribeSuccessful() {
    return this.isUnsubscribeProductSuccess
  },
  PaymentsIsPurchased(e) {
    return this.gp.payments.has(e)
  },
  PaymentsIsSubscribed(e) {
    e = this.gp.payments.getPurchase(e);
    return e && e.subscribed || !1
  },
  IsPaymentsAvailable() {
    return this.gp.payments.isAvailable
  },
  IsSubscriptionsAvailable() {
    return this.gp.payments.isSubscriptionsAvailable
  },
  OnImagesFetch() {
    return !0
  },
  OnImagesFetchError() {
    return !0
  },
  OnImagesFetchMore() {
    return !0
  },
  OnImagesFetchMoreError() {
    return !0
  },
  OnImagesUpload() {
    return !0
  },
  OnImagesUploadError() {
    return !0
  },
  OnImagesChoose() {
    return !0
  },
  OnImagesChooseError() {
    return !0
  },
  ImagesEachImage() {
    return each(this.runtime, this.images, (e, r) => {
      this.currentImageIndex = r, this.currentImage = e
    }), !1
  },
  ImagesEachTag(r) {
    var e = this.images.find(e => e.id === r),
      e = e ? e.tags : [];
    return each(this.runtime, e || [], (e, r) => {
      this.currentImageTagIndex = r, this.currentImageTag = e
    }), !1
  },
  ImagesCanLoadMore() {
    return this.canLoadMoreImages
  },
  ImagesCanUpload() {
    return this.gp.images.canUpload
  },
  OnFilesFetch() {
    return !0
  },
  OnFilesFetchError() {
    return !0
  },
  OnFilesFetchMore() {
    return !0
  },
  OnFilesFetchMoreError() {
    return !0
  },
  OnFilesUpload() {
    return !0
  },
  OnFilesUploadError() {
    return !0
  },
  OnFilesLoadContent() {
    return !0
  },
  OnFilesLoadContentError() {
    return !0
  },
  OnFilesChoose() {
    return !0
  },
  OnFilesChooseError() {
    return !0
  },
  FilesEachFile() {
    return each(this.runtime, this.files, (e, r) => {
      this.currentFileIndex = r, this.currentFile = e
    }), !1
  },
  FilesEachTag(r) {
    var e = this.files.find(e => e.id === r),
      e = e ? e.tags : [];
    return each(this.runtime, e || [], (e, r) => {
      this.currentFileTagIndex = r, this.currentFileTag = e
    }), !1
  },
  FilesCanLoadMore() {
    return this.canLoadMoreFiles
  },
  FilesCanUpload() {
    return this.gp.files.canUpload
  },
  OnVariablesFetch() {
    return !0
  },
  OnVariablesFetchError() {
    return !0
  },
  OnPlatformVariablesFetch() {
    return !0
  },
  OnPlatformVariablesFetchError() {
    return !0
  },
  isPlatformVariablesAvailable() {
    return this.gp.variables.isPlatformVariablesAvailable
  },
  VariablesEachVariable() {
    return each(this.runtime, this.gp.variables.list, (e, r) => {
      this.currentVariableIndex = r, this.currentVariable = e
    }), !1
  },
  VariablesCompare(e, r, t) {
    return this.mappers.compare[r](this.gp.variables.get(e), t)
  },
  VariablesCompareType(e, r) {
    return this.gp.variables.type(e) === this.mappers.variablesTypes[r]
  },
  VariablesHas(e) {
    return this.gp.variables.has(e)
  },
  OnFullscreenOpen() {
    return !0
  },
  OnFullscreenClose() {
    return !0
  },
  OnFullscreenChange() {
    return !0
  },
  IsFullscreenMode() {
    return this.gp.fullscreen.isEnabled
  },
  OnAdsStart() {
    return !0
  },
  OnAdsClose() {
    return !0
  },
  OnAdsFullscreenStart() {
    return !0
  },
  OnAdsFullscreenClose() {
    return !0
  },
  OnAdsPreloaderStart() {
    return !0
  },
  OnAdsPreloaderClose() {
    return !0
  },
  OnAdsRewardedStart(e) {
    return this.lastRewardedTag === e
  },
  OnAdsRewardedClose(e) {
    return this.lastRewardedTag === e
  },
  OnAdsRewardedReward(e) {
    return this.lastRewardedTag === e
  },
  OnAdsStickyStart() {
    return !0
  },
  OnAdsStickyClose() {
    return !0
  },
  OnAdsStickyRefresh() {
    return !0
  },
  OnAdsStickyRender() {
    return !0
  },
  IsAdsFullscreenAvailable() {
    return this.gp.ads.isFullscreenAvailable
  },
  IsAdsRewardedAvailable() {
    return this.gp.ads.isRewardedAvailable
  },
  IsAdsPreloaderAvailable() {
    return this.gp.ads.isPreloaderAvailable
  },
  IsAdsStickyAvailable() {
    return this.gp.ads.isStickyAvailable
  },
  IsAdsFullscreenPlaying() {
    return this.gp.ads.isFullscreenPlaying
  },
  CanShowFullscreenBeforeGamePlay() {
    return this.gp.ads.canShowFullscreenBeforeGamePlay
  },
  IsAdsRewardedPlaying() {
    return this.gp.ads.isRewardedPlaying
  },
  IsAdsPreloaderPlaying() {
    return this.gp.ads.isPreloaderPlaying
  },
  IsAdsStickyPlaying() {
    return this.gp.ads.isStickyPlaying
  },
  IsAdsAdblockEnabled() {
    return this.gp.ads.isAdblockEnabled
  },
  IsAdsLastAdSuccess() {
    return Boolean(this.isLastAdSuccess)
  },
  OnChangeLanguage() {
    return !0
  },
  OnChangeAvatarGenerator() {
    return !0
  },
  OnChangeOrientation() {
    return !0
  },
  OnOverlayReady() {
    return !0
  },
  IsDev() {
    return this.gp.isDev
  },
  IsMobile() {
    return this.gp.isMobile
  },
  DeviceType(e) {
    return this.gp.device.type === this.mappers.deviceTypes[e]
  },
  IsAllowedOrigin() {
    return this.gp.isAllowedOrigin
  },
  IsPortrait() {
    return this.gp.isPortrait
  },
  Language(e) {
    return this.gp.language === this.mappers.language[e]
  },
  OnPause() {
    return !0
  },
  OnResume() {
    return !0
  },
  IsPaused() {
    return this.gp.isPaused
  },
  OnGameplayStart() {
    return !0
  },
  OnGameplayStop() {
    return !0
  },
  IsGameplay() {
    return this.gp.isGameplay
  },
  HasPlatformIntegratedAuth() {
    return this.gp.platform.hasIntegratedAuth
  },
  IsPlatformLogoutAvailable() {
    return this.gp.platform.isLogoutAvailable
  },
  PlatformTag() {
    return this.gp.platform.tag
  },
  isPlatformSupportsCloudSaves() {
    return this.gp.platform.isSupportsCloudSaves
  },
  isPlatformSecretCodeAuthAvailable() {
    return this.gp.platform.isSecretCodeAuthAvailable
  },
  PlatformType(e) {
    return this.gp.platform.type === this.mappers.platform[e]
  },
  IsExternalLinksAllowedOnPlatform() {
    return this.gp.platform.isExternalLinksAllowed
  },
  OnSocialsShare() {
    return !0
  },
  OnSocialsPost() {
    return !0
  },
  OnSocialsInvite() {
    return !0
  },
  OnSocialsJoinCommunity() {
    return !0
  },
  IsSocialsLastShareSuccess() {
    return this.isLastShareSuccess
  },
  IsSocialsLastCommunityJoinSuccess() {
    return this.isLastCommunityJoinSuccess
  },
  IsSocialsSupportsShare() {
    return this.gp.socials.isSupportsShare
  },
  IsSocialsSupportsNativeShare() {
    return this.gp.socials.isSupportsNativeShare
  },
  IsSocialsSupportsNativePosts() {
    return this.gp.socials.isSupportsNativePosts
  },
  IsSocialsSupportsNativeInvite() {
    return this.gp.socials.isSupportsNativeInvite
  },
  IsSocialsSupportsNativeCommunityJoin() {
    return this.gp.socials.isSupportsNativeCommunityJoin
  },
  SocialsCanJoinCommunity() {
    return this.gp.socials.canJoinCommunity
  },
  OnAppAddShortcut() {
    return !0
  },
  OnAppReview() {
    return !0
  },
  OnAppReviewError() {
    return !0
  },
  IsAppLastAddShortcutSuccess() {
    return this.isLastAddShortcutSuccess
  },
  AppCanAddShortcut() {
    return this.gp.app.canAddShortcut
  },
  AppCanRequestReview() {
    return this.gp.app.canRequestReview
  },
  AppIsAlreadyReviewed() {
    return this.gp.app.isAlreadyReviewed
  },
  OnGamesCollectionsOpen() {
    return !0
  },
  OnGamesCollectionsClose() {
    return !0
  },
  OnGamesCollectionsFetchAny() {
    return !0
  },
  OnGamesCollectionsFetchAnyError() {
    return !0
  },
  OnGamesCollectionsFetch(e) {
    return this.lastGamesCollectionIdOrTag === e
  },
  OnGamesCollectionsFetchError(e) {
    return this.lastGamesCollectionIdOrTag === e
  },
  GamesCollectionsEachGame() {
    return each(this.runtime, this.gamesCollection.games, (e, r) => {
      this.currentGameIndex = r, this.currentGameId = e.id, this.currentGameName = e.name, this.currentGameDescription = e.description, this.currentGameIcon = e.icon, this.currentGameUrl = e.url
    }), !1
  },
  IsGamesCollectionsAvailable() {
    return this.gp.gamesCollections.isAvailable
  },
  OnDocumentsOpen() {
    return !0
  },
  OnDocumentsClose() {
    return !0
  },
  OnDocumentsFetchAny() {
    return !0
  },
  OnDocumentsFetchAnyError() {
    return !0
  },
  OnDocumentsFetch(e) {
    return this.lastDocumentType === this.mappers.documentTypes[e]
  },
  OnDocumentsFetchError(e) {
    return this.lastDocumentType === this.mappers.documentTypes[e]
  },
  OnPlayersFetch(e) {
    return this.lastPlayersTag === e
  },
  OnPlayersAnyFetch() {
    return !0
  },
  OnPlayersFetchError(e) {
    return this.lastPlayersTag === e
  },
  OnPlayersAnyFetchError() {
    return !0
  },
  PlayersEachPlayer() {
    return each(this.runtime, this.playersList, (e, r) => {
      this.currentPlayersIndex = r, this.currentPlayersPlayer = e
    }), !1
  },
  PlayersEachPlayerAchievement() {
    return each(this.runtime, this.currentPlayersPlayer.achievements, (e, r) => {
      this.currentPlayerAchievementIndex = r, this.currentPlayerAchievementId = e.id, this.currentPlayerAchievementUnlockDate = e.createdAt
    }), !1
  },
  PlayersEachPlayerPurchase() {
    return each(this.runtime, this.currentPlayersPlayer.purchases, (e, r) => {
      this.currentPurchaseIndex = r, this.currentPurchase = e
    }), !1
  },
  OnRewardsAccept(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  OnRewardsAcceptError(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  OnRewardsGive(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  OnRewardsGiveError(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  RewardsPick(e) {
    e = this.gp.rewards.getReward(e) || {};
    return this.setReward(e), isExists(e.reward)
  },
  RewardsEachReward() {
    return each(this.runtime, this.gp.rewards.list, (e, r) => {
      e = this.gp.rewards.getReward(e.id);
      this.setReward(e, r)
    }), !1
  },
  IsRewardsCurAccepted() {
    return 0 < this.curPlayerReward.countAccepted
  },
  IsRewardsCurGiven() {
    return 0 < this.curPlayerReward.countTotal
  },
  IsRewardsCurHasAutoAccept() {
    return this.curReward.isAutoAccept
  },
  RewardsHas(e) {
    return this.gp.rewards.has(e)
  },
  RewardsHasAccepted(e) {
    return this.gp.rewards.hasAccepted(e)
  },
  RewardsHasUnaccepted(e) {
    return this.gp.rewards.hasUnaccepted(e)
  },
  OnTriggersActivate(e) {
    return !e || this.lastIdOrTag.id === e || this.lastIdOrTag.tag === e
  },
  OnTriggersClaim(e) {
    return !e || this.lastIdOrTag.id === e || this.lastIdOrTag.tag === e
  },
  OnTriggersClaimError(e) {
    return !e || this.lastIdOrTag.id === e || this.lastIdOrTag.tag === e
  },
  TriggersPick(e) {
    return this.setTriggerInfo(e), isExists(this.curTriggerInfo.trigger)
  },
  TriggersEachTrigger() {
    return each(this.runtime, this.gp.triggers.list, (e, r) => {
      this.setTriggerInfo(e.id, r)
    }), !1
  },
  TriggersEachBonus() {
    return each(this.runtime, this.curTriggerInfo.trigger.bonuses || [], (e, r) => {
      this.setBonus(e, r)
    }), !1
  },
  IsTriggersCurActivated() {
    return !!this.curTriggerInfo.isActivated
  },
  IsTriggersCurClaimed() {
    return !!this.curTriggerInfo.isClaimed
  },
  IsTriggersCurHasAutoClaim() {
    return !!this.curTriggerInfo.trigger.isAutoClaim
  },
  TriggersIsActivated(e) {
    return this.gp.triggers.isActivated(e)
  },
  TriggersIsClaimed(e) {
    return this.gp.triggers.isClaimed(e)
  },
  BonusType(e) {
    return this.curBonus.type === this.mappers.bonusType[e]
  },
  OnSchedulersRegister(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  OnSchedulersRegisterError(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  OnSchedulersClaimDay(e, r) {
    return this.isPickedSchedulerDayAndTrigger(e, r)
  },
  OnSchedulersClaimDayError(e, r) {
    return this.isPickedSchedulerDayAndTrigger(e, r)
  },
  OnSchedulersClaimDayAdditional(e, r, t) {
    return this.isPickedSchedulerDayAndTrigger(e, r, t)
  },
  OnSchedulersClaimDayAdditionalError(e, r, t) {
    return this.isPickedSchedulerDayAndTrigger(e, r, t)
  },
  OnSchedulersClaimAllDay(e, r) {
    return this.isPickedSchedulerDayAndTrigger(e, r)
  },
  OnSchedulersClaimAllDayError(e, r) {
    return this.isPickedSchedulerDayAndTrigger(e, r)
  },
  OnSchedulersClaimAllDays(e) {
    return this.isPickedSchedulerDayAndTrigger(e)
  },
  OnSchedulersClaimAllDaysError(e) {
    return this.isPickedSchedulerDayAndTrigger(e)
  },
  SchedulersPick(e) {
    return this.setSchedulerInfo(e), isExists(this.curSchedulerInfo.scheduler)
  },
  SchedulersPickDay(e, r) {
    return this.setSchedulerDayInfo(e, r), isExists(this.curSchedulerDayInfo.scheduler) && this.curSchedulerDayInfo.day === r
  },
  SchedulersPickDayAdditional(e, r, t) {
    this.setSchedulerDayInfo(e, r);
    e = this.curSchedulerDayInfo.triggers || [];
    return !!e[t] && (this.setTriggerInfo(e[t].id), !!this.curTriggerInfo.trigger)
  },
  SchedulersEachScheduler() {
    return each(this.runtime, this.gp.schedulers.list, (e, r) => {
      this.setSchedulerInfo(e.id, r)
    }), !1
  },
  SchedulersEachCurSchedulerDay() {
    var e = Array.from({
      length: this.curSchedulerInfo.scheduler.days || 0
    });
    return each(this.runtime, e, (e, r) => {
      this.setSchedulerDayInfo(this.curSchedulerInfo.scheduler.id, r + 1)
    }), !1
  },
  SchedulersEachCurSchedulerDaysClaimed() {
    return each(this.runtime, this.curSchedulerInfo.daysClaimed, e => {
      this.setSchedulerDayInfo(this.curSchedulerInfo.scheduler.id, e)
    }), !1
  },
  SchedulersEachCurSchedulerDayBonuses() {
    return each(this.runtime, this.curSchedulerDayInfo.bonuses || [], (e, r) => {
      this.setBonus(e, r)
    }), !1
  },
  SchedulersEachCurSchedulerDayTriggers() {
    return each(this.runtime, this.curSchedulerDayInfo.triggers || [], (e, r) => {
      this.setTriggerInfo(e.id, r)
    }), !1
  },
  IsSchedulersCurRegistered() {
    return this.curSchedulerInfo.isRegistered
  },
  IsSchedulersCurAutoRegister() {
    return !!this.curSchedulerInfo.scheduler.isAutoRegister
  },
  IsSchedulersCurRepeatable() {
    return this.curSchedulerInfo.scheduler.isRepeat
  },
  IsSchedulersCurDayReached() {
    return this.curSchedulerDayInfo.isDayReached
  },
  IsSchedulersCurDayComplete() {
    return this.curSchedulerDayInfo.isDayComplete
  },
  IsSchedulersCurDayClaimed() {
    return this.curSchedulerDayInfo.isDayClaimed
  },
  IsSchedulersCurDayAllClaimed() {
    return this.curSchedulerDayInfo.isAllDayClaimed
  },
  IsSchedulersCurDayCanClaim() {
    return this.curSchedulerDayInfo.canClaimDay
  },
  IsSchedulersCurDayCanClaimAll() {
    return this.curSchedulerDayInfo.canClaimAllDay
  },
  SchedulersIsRegistered(e) {
    return this.gp.schedulers.isRegistered(e)
  },
  SchedulersIsTodayRewardClaimed(e) {
    return this.gp.schedulers.isTodayRewardClaimed(e)
  },
  SchedulersCanClaimDay(e, r) {
    return this.gp.schedulers.canClaimDay(e, r)
  },
  SchedulersCanClaimDayAdditional(e, r, t) {
    return this.gp.schedulers.canClaimDayAdditional(e, r, t)
  },
  SchedulersCanClaimAllDay(e, r) {
    return this.gp.schedulers.canClaimAllDay(e, r)
  },
  SchedulersCurType(e) {
    return this.curSchedulerInfo.scheduler.type === this.mappers.schedulerType[e]
  },
  OnEventsJoin(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  OnEventsJoinError(e) {
    return !e || this.isPickedIdOrTag(e)
  },
  EventsPick(e) {
    return this.setEventInfo(e), isExists(this.curEventInfo.event)
  },
  EventsEachEvent() {
    return each(this.runtime, this.gp.events.list, (e, r) => {
      this.setEventInfo(e.id, r)
    }), !1
  },
  EventsEachCurEventTriggers() {
    return each(this.runtime, this.curEventInfo.event.triggers || [], (e, r) => {
      this.setTriggerInfo(e.id, r)
    }), !1
  },
  IsEventsCurJoined() {
    return this.curEventInfo.isJoined
  },
  IsEventsCurActive() {
    return this.curEventInfo.event.isActive
  },
  IsEventsCurAutoJoin() {
    return this.curEventInfo.event.isAutoJoin
  },
  EventsHas(e) {
    return this.gp.events.has(e)
  },
  EventsIsJoined(e) {
    return this.gp.events.isJoined(e)
  },
  ExperimentsHas(e, r) {
    return this.gp.experiments.has(e, r)
  },
  OnSegmentsEnter() {
    return !0
  },
  OnSegmentsLeave() {
    return !0
  },
  SegmentsHas(e) {
    return this.gp.segments.has(e)
  },
  SegmentsEachSegment() {
    return each(this.runtime, this.gp.segments.list || [], e => {
      this.curSegment = e
    }), !1
  },
  IsLastActionSuccess() {
    return this.isLastActionSuccess
  },
  OnLoadJsonError() {
    return !0
  },
  OnUniquesRegister() {
    return !0
  },
  OnUniquesRegisterError() {
    return !0
  },
  OnUniquesCheck() {
    return !0
  },
  OnUniquesCheckError() {
    return !0
  },
  OnUniquesDelete() {
    return !0
  },
  OnUniquesDeleteError() {
    return !0
  },
  UniquesEachUnique() {
    return each(this.runtime, this.gp.uniques.list, e => {
      this.currentUniquesTag = e.tag, this.currentUniquesValue = e.value
    }), !1
  },
  OnStorageGet() {
    return !0
  },
  OnStorageSet() {
    return !0
  },
  OnStorageGetGlobal() {
    return !0
  },
  OnStorageSetGlobal() {
    return !0
  },
  OnWindowsConfirmClose() {
    return !0
  },
  OnMute() {
    return !0
  },
  OnUnmute() {
    return !0
  },
  OnMuteSFX() {
    return !0
  },
  OnUnmuteSFX() {
    return !0
  },
  OnMuteMusic() {
    return !0
  },
  OnUnmuteMusic() {
    return !0
  },
  IsSFXMuted() {
    return this.gp.sounds.isSFXMuted
  },
  IsMusicMuted() {
    return this.gp.sounds.isMusicMuted
  },
  IsMuted() {
    return this.gp.sounds.isMuted
  }
};