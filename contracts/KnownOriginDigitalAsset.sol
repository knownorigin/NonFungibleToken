pragma solidity 0.4.18;


import "./InternalMintableNonFungibleToken.sol";


/**
 * @title KnownOriginDigitalAsset
 *
 * A curator can mint digital assets and sell them via purchases (crypto via Ether or Fiat)
 */
contract KnownOriginDigitalAsset is InternalMintableNonFungibleToken {
    using SafeMath for uint;

    // creates and owns the original assets
    // all primary purchases transfered to this account
    address public curator;

    uint256 public totalPurchaseValueInWei;
    uint public totalNumberOfPurchases;

    enum PurchaseState { Unsold, EtherPurchase, FiatPurchase }

    mapping(uint => PurchaseState) internal tokenIdToPurchased;
    mapping(uint => string) internal tokenIdToEdition;
    mapping(uint => uint256) internal tokenIdToPriceInWei;

    event PurchasedWithEther(uint256 indexed _tokenId, address indexed _buyer);
    event PurchasedWithFiat(uint256 indexed _tokenId);

    modifier onlyCurator() {
        require(msg.sender == curator);
        _;
    }

    modifier onlyUnpurchased(uint256 _tokenId) {
        require(tokenIdToPurchased[_tokenId] == PurchaseState.Unsold);
        _;
    }

    modifier onlyCuratorOwnedToken(uint256 _tokenId) {
        require(tokenIdToOwner[_tokenId] == curator);
        _;
    }

    function KnownOriginDigitalAsset()
    public {
        curator = msg.sender;
        name = "KnownOriginDigitalAsset";
        symbol = "KODA";
    }

    function mintEdition(string _metadata, string _edition, uint8 _totalEdition, uint256 _priceInWei)
    public
    onlyCurator {

        var offset = numTokensTotal;
        for (uint8 i = 0; i < _totalEdition; i++) {
            var _tokenId = offset + i;
            require(tokenIdToOwner[_tokenId] == address(0));
            _mint(msg.sender, _tokenId, _metadata);
            tokenIdToEdition[_tokenId] = _edition;
            tokenIdToPriceInWei[_tokenId] = _priceInWei;
        }
    }

    function mint(string _metadata, string _edition, uint256 _priceInWei)
    public
    onlyCurator {
        var _tokenId = numTokensTotal;
        require(tokenIdToOwner[_tokenId] == address(0));
        _mint(msg.sender, _tokenId, _metadata);
        tokenIdToEdition[_tokenId] = _edition;
        tokenIdToPriceInWei[_tokenId] = _priceInWei;
    }

    function isPurchased(uint256 _tokenId)
    public
    view
    returns (PurchaseState _purchased) {
        return tokenIdToPurchased[_tokenId];
    }

    function editionOf(uint _tokenId)
    public
    view
    returns (string _edition) {
        return tokenIdToEdition[_tokenId];
    }

    function priceOfInWei(uint _tokenId)
    public
    view
    returns (uint256 _priceInWei) {
        return tokenIdToPriceInWei[_tokenId];
    }

    function setPriceInWei(uint _tokenId, uint256 _priceInWei)
    public
    onlyCurator
    onlyUnpurchased(_tokenId)
    onlyCuratorOwnedToken(_tokenId)
    returns (bool) {
        tokenIdToPriceInWei[_tokenId] = _priceInWei;
        return true;
    }

    function purchaseWithEther(uint _tokenId)
    public
    payable
    onlyUnpurchased(_tokenId)
    onlyCuratorOwnedToken(_tokenId)
    returns (bool) {

        if (msg.value >= tokenIdToPriceInWei[_tokenId]) {

            // approve sender as they have paid the required amount
            _approve(msg.sender, _tokenId);
            Approval(curator, msg.sender, _tokenId);

            // transfer assets from contract creator (curator) to new owner
            transferFrom(curator, msg.sender, _tokenId);

            // now purchased - don't allow re-purchase!
            tokenIdToPurchased[_tokenId] = PurchaseState.EtherPurchase;

            totalPurchaseValueInWei = totalPurchaseValueInWei.add(msg.value);
            totalNumberOfPurchases = totalNumberOfPurchases.add(1);

            // send ether to owner instantly
            curator.transfer(msg.value);

            PurchasedWithEther(_tokenId, msg.sender);

            return true;
        }

        return false;
    }

    function purchaseWithFiat(uint _tokenId)
    public
    onlyCurator
    onlyUnpurchased(_tokenId)
    onlyCuratorOwnedToken(_tokenId)
    returns (bool) {

        // now purchased - don't allow re-purchase!
        tokenIdToPurchased[_tokenId] = PurchaseState.FiatPurchase;

        totalNumberOfPurchases = totalNumberOfPurchases.add(1);

        PurchasedWithFiat(_tokenId);

        return true;
    }

    function assetInfo(uint _tokenId)
    public
    view
    returns (
    uint256 _tokId,
    address _owner,
    string _metadata,
    string _edition,
    PurchaseState _purchaseState,
    uint256 _priceInWei
    ) {
        return (
        _tokenId,
        tokenIdToOwner[_tokenId],
        tokenIdToMetadata[_tokenId],
        tokenIdToEdition[_tokenId],
        tokenIdToPurchased[_tokenId],
        tokenIdToPriceInWei[_tokenId]
        );
    }
}